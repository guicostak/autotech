package com.web.AutoTech.services.vendedor;

import com.web.AutoTech.controllers.dto.request.CompleteAddressRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorCreateRequestDTO;
import com.web.AutoTech.domain.EnderecoDomainEntity;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.VendedorDomainEntity;
import com.web.AutoTech.exceptions.BusinessException;
import com.web.AutoTech.exceptions.DataBindingViolationException;
import com.web.AutoTech.exceptions.ObjectNotFoundException;
import com.web.AutoTech.repositories.EnderecoDomainEntityRepository;
import com.web.AutoTech.repositories.VendedorDomainEntityRepository;
import com.web.AutoTech.services.aws.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class VendedorServiceImplTest {

    @Mock
    private VendedorDomainEntityRepository vendedorDomainEntityRepository;

    @Mock
    private EnderecoDomainEntityRepository enderecoDomainEntityRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private VendedorServiceImpl vendedorService;

    private static final Long USER_ID = 1L;
    private static final Long VENDEDOR_ID = 1L;
    private UsuarioDomainEntity usuario;
    private VendedorCreateRequestDTO vendedorCreateRequestDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        usuario = new UsuarioDomainEntity();
        usuario.setId(USER_ID);

        vendedorCreateRequestDTO = new VendedorCreateRequestDTO();
        vendedorCreateRequestDTO.setCnpj("12345678000195");
        vendedorCreateRequestDTO.setEmailEmpresa("vendedor@empresa.com");
    }

    @Test
    void testCreateVendedor_WhenVendedorDoesNotExist() {
        when(vendedorDomainEntityRepository.existsUserByCnpj(vendedorCreateRequestDTO.getCnpj())).thenReturn(false);
        when(vendedorDomainEntityRepository.existsUserByEmailEmpresa(vendedorCreateRequestDTO.getEmailEmpresa())).thenReturn(false);
        when(vendedorDomainEntityRepository.save(any(VendedorDomainEntity.class))).thenReturn(new VendedorDomainEntity());

        vendedorService.createVendedor(usuario, vendedorCreateRequestDTO);

        verify(vendedorDomainEntityRepository, times(1)).save(any(VendedorDomainEntity.class));
    }

    @Test
    void testCreateVendedor_WhenCnpjAlreadyExists() {
        when(vendedorDomainEntityRepository.existsUserByCnpj(vendedorCreateRequestDTO.getCnpj())).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class, () ->
                vendedorService.createVendedor(usuario, vendedorCreateRequestDTO));

        assertEquals("CNPJ já está cadastrado", exception.getMessage());
    }

    @Test
    void testGetVendedorByUsuarioId_WhenVendedorExists() {
        VendedorDomainEntity vendedor = new VendedorDomainEntity();
        vendedor.setId(VENDEDOR_ID);
        when(vendedorDomainEntityRepository.findByUsuarioId(USER_ID)).thenReturn(java.util.Optional.of(vendedor));

        VendedorDomainEntity result = vendedorService.getVendedorByUsuarioId(USER_ID);

        assertNotNull(result);
        assertEquals(VENDEDOR_ID, result.getId());
    }

    @Test
    void testGetVendedorByUsuarioId_WhenVendedorDoesNotExist() {
        when(vendedorDomainEntityRepository.findByUsuarioId(USER_ID)).thenReturn(java.util.Optional.empty());

        ObjectNotFoundException exception = assertThrows(ObjectNotFoundException.class, () ->
                vendedorService.getVendedorByUsuarioId(USER_ID));

        assertEquals("Vendedor não encontrado! Usuário ID: " + USER_ID + ", Tipo: com.web.AutoTech.domain.VendedorDomainEntity", exception.getMessage());
    }

    @Test
    void testDeleteVendedor_WhenDeletionIsSuccessful() {
        doNothing().when(vendedorDomainEntityRepository).deleteById(VENDEDOR_ID);

        vendedorService.deleteVendedor(VENDEDOR_ID);

        verify(vendedorDomainEntityRepository, times(1)).deleteById(VENDEDOR_ID);
    }

    @Test
    void testDeleteVendedor_WhenDataIntegrityViolationOccurs() {
        doThrow(DataIntegrityViolationException.class).when(vendedorDomainEntityRepository).deleteById(VENDEDOR_ID);

        DataBindingViolationException exception = assertThrows(DataBindingViolationException.class, () ->
                vendedorService.deleteVendedor(VENDEDOR_ID));

        assertEquals("Não é possível excluir um vendedor relacionado a outra entidade.", exception.getMessage());
    }

    @Test
    void testCompleteProfileVendedor() {
        CompleteAddressRequestDTO addressRequest = new CompleteAddressRequestDTO();
        addressRequest.setCep("12345-678");
        when(vendedorDomainEntityRepository.findByUsuarioId(USER_ID)).
                thenReturn(java.util.Optional.of(VendedorDomainEntity.builder()
                                .enderecos(List.of(EnderecoDomainEntity.builder().build()))
                        .build()));

        EnderecoDomainEntity endereco = new EnderecoDomainEntity();
        endereco.setCep(addressRequest.getCep());
        when(enderecoDomainEntityRepository.save(any(EnderecoDomainEntity.class))).thenReturn(endereco);

        // When
        EnderecoDomainEntity result = vendedorService.completeProfileVendedor(addressRequest, USER_ID);

        // Then
        assertNotNull(result);
        assertEquals(addressRequest.getCep(), result.getCep());
    }
}
