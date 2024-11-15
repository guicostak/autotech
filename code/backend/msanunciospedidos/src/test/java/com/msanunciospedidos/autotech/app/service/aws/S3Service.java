package com.msanunciospedidos.autotech.app.service.aws;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class S3ServiceTest {

    @Mock
    private S3Client s3Client;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private S3Service s3Service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void uploadFile_deveRetornarUrlDoArquivo_quandoUploadBemSucedido() throws IOException {
        // Mock do arquivo multipart
        when(multipartFile.getOriginalFilename()).thenReturn("testfile.jpg");
        when(multipartFile.getBytes()).thenReturn("file-content".getBytes());
        when(multipartFile.getContentType()).thenReturn("image/jpeg");

        // Mock do comportamento do S3Client
        doNothing().when(s3Client).putObject(any(PutObjectRequest.class), any(RequestBody.class));

        // Chamada do método
        final var futureUrl = s3Service.uploadFile(multipartFile);

        // Verificação
        assertNotNull(futureUrl);
        assertTrue(futureUrl.isDone());

        String fileUrl = futureUrl.join();  // Espera o CompletableFuture ser concluído
        assertTrue(fileUrl.contains("s3.amazonaws.com"));
        assertTrue(fileUrl.contains(".jpg"));

        // Verifica se o S3Client foi chamado corretamente
        verify(s3Client, times(1)).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    void uploadFile_deveLancarExcecao_quandoFalhaAoLerArquivo() throws IOException {
        // Mock para lançar exceção ao tentar obter os bytes do arquivo
        when(multipartFile.getOriginalFilename()).thenReturn("testfile.jpg");
        when(multipartFile.getBytes()).thenThrow(new IOException("Erro ao ler arquivo"));

        // Chamada do método e captura da exceção
        Exception exception = assertThrows(IOException.class, () -> s3Service.uploadFile(multipartFile).join());

        // Verificação da mensagem da exceção
        assertEquals("Erro ao ler arquivo", exception.getMessage());

        // Verifica que o S3Client não foi chamado, pois houve erro ao ler o arquivo
        verify(s3Client, never()).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    void uploadFile_deveLancarExcecao_quandoFalhaNoUploadS3() throws IOException {
        // Mock do arquivo multipart
        when(multipartFile.getOriginalFilename()).thenReturn("testfile.jpg");
        when(multipartFile.getBytes()).thenReturn("file-content".getBytes());
        when(multipartFile.getContentType()).thenReturn("image/jpeg");

        // Mock para lançar exceção ao tentar enviar o arquivo para o S3
        doThrow(new RuntimeException("Erro no upload para o S3")).when(s3Client).putObject(any(PutObjectRequest.class), any(RequestBody.class));

        // Chamada do método e captura da exceção
        Exception exception = assertThrows(RuntimeException.class, () -> {
            s3Service.uploadFile(multipartFile).join();
        });

        // Verificação da mensagem da exceção
        assertEquals("Erro no upload para o S3", exception.getMessage());

        // Verifica se o S3Client foi chamado corretamente antes de falhar
        verify(s3Client, times(1)).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }
}
