package com.web.AutoTech.services.usuario;

import com.web.AutoTech.controllers.dto.request.UsuarioCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioUpdateRequestDTO;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.enums.EmailType;
import com.web.AutoTech.exceptions.BusinessException;
import com.web.AutoTech.exceptions.DataBindingViolationException;
import com.web.AutoTech.exceptions.ObjectNotFoundException;
import com.web.AutoTech.repositories.UsuarioDomainEntityRepository;
import com.web.AutoTech.services.aws.S3Service;
import com.web.AutoTech.services.email.EmailService;
import com.web.AutoTech.services.email.EmailServiceImpl;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


class UsuarioServiceImplTest {

    @InjectMocks
    private UsuarioServiceImpl usuarioServiceImpl;

    @Mock
    private UsuarioDomainEntityRepository usuarioDomainEntityRepository;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Mock
    private EmailServiceImpl emailService;

    private UsuarioDomainEntity usuarioDomainEntity;

    @Mock
    private S3Service s3Service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        usuarioDomainEntity = new UsuarioDomainEntity();
        usuarioDomainEntity.setEmail("test@example.com");
        usuarioDomainEntity.setId(1L);
        usuarioDomainEntity.setPassword("encodedPassword");
    }

    @Test
    void testGetUserById_Success() {
        when(usuarioDomainEntityRepository.findById(anyLong())).thenReturn(Optional.of(usuarioDomainEntity));

        UsuarioDomainEntity result = usuarioServiceImpl.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(usuarioDomainEntityRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserById_NotFound() {
        when(usuarioDomainEntityRepository.findById(anyLong())).thenReturn(Optional.empty());

        ObjectNotFoundException exception = assertThrows(ObjectNotFoundException.class, () -> {
            usuarioServiceImpl.getUserById(1L);
        });

        assertEquals("Usuário não encontrado! Id: 1, Tipo: com.web.AutoTech.domain.UsuarioDomainEntity", exception.getMessage());
    }

    @Test
    void testGetUserByEmail_Success() {
        when(usuarioDomainEntityRepository.findByEmail(anyString())).thenReturn(Optional.of(usuarioDomainEntity));

        UsuarioDomainEntity result = usuarioServiceImpl.getUserByEmail("test@example.com");

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(usuarioDomainEntityRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testGetUserByEmail_NotFound() {
        when(usuarioDomainEntityRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        ObjectNotFoundException exception = assertThrows(ObjectNotFoundException.class, () -> {
            usuarioServiceImpl.getUserByEmail("nonexistent@example.com");
        });

        assertEquals("Usuário não cadastrado! Crie uma conta. " , exception.getMessage());
    }

    @Test
    void testCreateUser_Success() throws MessagingException, IOException {
        UsuarioCreateRequestDTO createDTO = new UsuarioCreateRequestDTO();
        createDTO.setEmail("newuser@example.com");
        createDTO.setPassword("password");

        when(bCryptPasswordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(usuarioDomainEntityRepository.save(any(UsuarioDomainEntity.class))).thenReturn(usuarioDomainEntity);

        UsuarioDomainEntity result = usuarioServiceImpl.createUser(createDTO);
        assertNotNull(result);
        assertEquals("newuser@example.com", result.getEmail());
        verify(usuarioDomainEntityRepository, times(1)).save(any(UsuarioDomainEntity.class));
        verify(bCryptPasswordEncoder, times(1)).encode("password");
    }

    @Test
    void testDeleteUser_Success() {
        when(usuarioDomainEntityRepository.findById(anyLong())).thenReturn(Optional.of(usuarioDomainEntity));
        doNothing().when(usuarioDomainEntityRepository).deleteById(anyLong());

        usuarioServiceImpl.deleteUser(1L);

        verify(usuarioDomainEntityRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteUser_DataIntegrityViolation() {
        when(usuarioDomainEntityRepository.findById(anyLong())).thenReturn(Optional.of(usuarioDomainEntity));
        doThrow(DataIntegrityViolationException.class).when(usuarioDomainEntityRepository).deleteById(anyLong());

        DataBindingViolationException exception = assertThrows(DataBindingViolationException.class, () -> {
            usuarioServiceImpl.deleteUser(1L);
        });

        assertEquals("Não é possível excluir um usuário relacionado a outra entidade.", exception.getMessage());
    }

    @Test
    void testDeleteUser_UnhandledException() {
        when(usuarioDomainEntityRepository.findById(anyLong())).thenReturn(Optional.of(usuarioDomainEntity));
        doThrow(RuntimeException.class).when(usuarioDomainEntityRepository).deleteById(anyLong());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioServiceImpl.deleteUser(1L);
        });

        assertEquals("Erro interno ao tentar deletar o usuário. Contate o suporte.", exception.getMessage());
    }

    @Test
    void testUpdateUser_Success() throws IOException {
        UsuarioUpdateRequestDTO updateRequestDTO = new UsuarioUpdateRequestDTO();
        updateRequestDTO.setImagemPerfil("Mock for MultipartFile, hashCode: 1859965144");
        updateRequestDTO.setEmail("updateduser@example.com");

        final var existedUser = UsuarioDomainEntity.builder()
                .id(1L)
                .cpf("12345678901")
                .nome("Lucas Alves")
                .telefone("99999999999")
                .email("oldEmail@example.com")
                .imagem("oldUrlImage.com")
                .emailConfirmed(false)
                .build();

        final var newUser = UsuarioDomainEntity.builder()
                .id(1L)
                .cpf("12345678901")
                .nome("Lucas Alves")
                .email(updateRequestDTO.getEmail())
                .imagem("https://mockurl.com/imagem.jpg")
                .emailConfirmed(false)
                .build();

        when(usuarioDomainEntityRepository.findById(1L)).thenReturn(Optional.of(existedUser));
        when(s3Service.uploadFile("Mock for MultipartFile, hashCode: 1859965144")).thenReturn("https://mockurl.com/imagem.jpg");
        when(usuarioDomainEntityRepository.save(newUser)).thenReturn(newUser);

        usuarioServiceImpl.updateUser(updateRequestDTO, 1L);

        verify(s3Service, times(1)).uploadFile("Mock for MultipartFile, hashCode: 1859965144");
        assertEquals("https://mockurl.com/imagem.jpg", newUser.getImagem());

        verify(usuarioDomainEntityRepository, times(1)).save(newUser);

        assertEquals("updateduser@example.com", newUser.getEmail());
    }

    @Test
    void testUpdateUser_CpfAlreadyExists() {
        UsuarioUpdateRequestDTO updateRequestDTO = new UsuarioUpdateRequestDTO();
        updateRequestDTO.setCpf("12345678901");

        when(usuarioDomainEntityRepository.findById(anyLong())).thenReturn(Optional.of(usuarioDomainEntity));
        when(usuarioDomainEntityRepository.existsUserByCpf(anyString())).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            usuarioServiceImpl.updateUser(updateRequestDTO, 1L);
        });

        assertEquals("CPF já cadastrado", exception.getMessage());
    }

    @Test
    void testUpdateUser_UserNotFound() {
        UsuarioUpdateRequestDTO updateRequestDTO = new UsuarioUpdateRequestDTO();
        updateRequestDTO.setCpf("12345678901");

        when(usuarioDomainEntityRepository.findById(anyLong())).thenReturn(Optional.empty());

        ObjectNotFoundException exception = assertThrows(ObjectNotFoundException.class, () -> {
            usuarioServiceImpl.updateUser(updateRequestDTO, 1L);
        });

        assertEquals("Usuário não encontrado! Id: 1, Tipo: com.web.AutoTech.domain.UsuarioDomainEntity", exception.getMessage());
    }
}

