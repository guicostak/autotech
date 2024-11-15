package com.msanunciospedidos.autotech.app.controller;

import com.msanunciospedidos.autotech.app.controller.dto.request.AnuncioRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.response.AnuncioResponseDTO;
import com.msanunciospedidos.autotech.app.domain.AnuncioDomainEntity;
import com.msanunciospedidos.autotech.app.domain.enums.TipoAnuncioPesquisa;
import com.msanunciospedidos.autotech.app.service.anuncio.AnuncioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;
import jakarta.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
public class AnuncioControllerTest {

    @Mock
    private AnuncioService anuncioService;

    @InjectMocks
    private AnuncioController anuncioController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void criarAnuncio_deveRetornarSucesso_quandoAnuncioCriado() {
        final var anuncioRequestDTO = new AnuncioRequestDTO();
        List<MultipartFile> imagens = List.of(mock(MultipartFile.class));
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        doNothing()
                .when(anuncioService).criarAnuncio(any(AnuncioRequestDTO.class), anyList());

        final var response = anuncioController.criarAnuncio(anuncioRequestDTO, imagens, mockRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Anúncio criado com sucesso!", response.getBody());

        verify(anuncioService, times(1)).criarAnuncio(anuncioRequestDTO, imagens);
    }

    @Test
    void criarAnuncio_deveRetornarErro_quandoFalhaNaCriacao() {
        AnuncioRequestDTO anuncioRequestDTO = new AnuncioRequestDTO();
        List<MultipartFile> imagens = List.of(mock(MultipartFile.class));
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        doThrow(new RuntimeException("Erro ao criar anúncio")).when(anuncioService)
                .criarAnuncio(any(AnuncioRequestDTO.class), anyList());

        final var response = anuncioController.criarAnuncio(anuncioRequestDTO, imagens, mockRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Erro ao criar anúncio", response.getBody());

        verify(anuncioService, times(1)).criarAnuncio(anuncioRequestDTO, imagens);
    }

    @Test
    void consultarAnuncio_deveRetornarAnuncio_quandoEncontrado() {
        // Mock do response DTO
        final var anuncioResponseDTO = new AnuncioResponseDTO(); // Popule os campos conforme necessário

        // Configurar o mock para retornar o objeto
        when(anuncioService.consultarAnuncio(1L)).thenReturn(anuncioResponseDTO);

        // Chamada do método
        final var response = anuncioController.consultarAnuncio(1L);

        // Verificações
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(anuncioResponseDTO, response.getBody());

        // Verifique se o serviço foi chamado
        verify(anuncioService, times(1)).consultarAnuncio(1L);
    }

    @Test
    void consultarAnuncio_deveRetornarNotFound_quandoNaoEncontrado() {
        // Configurar o mock para retornar null
        when(anuncioService.consultarAnuncio(1L)).thenReturn(null);

        // Chamada do método
        final var response = anuncioController.consultarAnuncio(1L);

        // Verificações
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());

        // Verifique se o serviço foi chamado
        verify(anuncioService, times(1)).consultarAnuncio(1L);
    }

    @Test
    void listarAnuncios_deveRetornarListaAnuncios_quandoSucesso() {
        // Mock de uma página de anúncios
        Page<AnuncioDomainEntity> pageAnuncios = new PageImpl<>(List.of(new AnuncioDomainEntity()),
                PageRequest.of(0, 10), 1);

        // Configurar o mock para retornar a página
        when(anuncioService.listarAnunciosPaginadosComFiltros(anyInt(), anyInt(), anyString(), anyString(), anyString(),
                anyDouble(), anyDouble(), anyInt(), anyString(), anyString(), anyString(), TipoAnuncioPesquisa.AMBOS))
                .thenReturn(pageAnuncios);

        // Chamada do método
        final var response = anuncioController.listarAnuncios(0, 10,
                null, null, null, null, null, null,
                null, null, null, null);

        // Verificações
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(pageAnuncios, response.getBody());

        // Verifique se o serviço foi chamado
        verify(anuncioService, times(1)).listarAnunciosPaginadosComFiltros(0, 10, null, null, null, null,
                null, null, null, null, null, null);
    }

    @Test
    void listarAnuncios_deveRetornarListaAnuncios_quandoFiltrosAplicados() {
        // Mock de uma página de anúncios
        Page<AnuncioDomainEntity> pageAnuncios = new PageImpl<>(List.of(new AnuncioDomainEntity()),
                PageRequest.of(0, 10), 1);

        // Configurar o mock para retornar a página com filtros
        when(anuncioService.listarAnunciosPaginadosComFiltros(0, 10, "marca", "modelo", "categoria", 1000.0, 5000.0,
                2020, "motor", "dataCriacao", "desc", TipoAnuncioPesquisa.AMBOS))
                .thenReturn(pageAnuncios);

        // Chamada do método com filtros
        final var response = anuncioController.listarAnuncios(0, 10, "marca", "modelo",
                "categoria", 1000.0, 5000.0, 2020, "motor",
                "dataCriacao", "asc", "AMBOS");

        // Verificações
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(pageAnuncios, response.getBody());

        // Verifique se o serviço foi chamado com os filtros corretos
        verify(anuncioService, times(1)).listarAnunciosPaginadosComFiltros(0,
                10, "marca", "modelo", "categoria", 1000.0,
                5000.0, 2020, "motor", "dataCriacao", "asc", TipoAnuncioPesquisa.AMBOS);
    }
}
