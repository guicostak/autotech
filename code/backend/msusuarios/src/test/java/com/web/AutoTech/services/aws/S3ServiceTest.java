package com.web.AutoTech.services.aws;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class S3ServiceTest {

    private S3Client mockS3Client;
    private S3Service s3Service;
    private final String bucketName = "test-bucket";

    @BeforeEach
    void setUp() {
        mockS3Client = mock(S3Client.class);
        s3Service = new S3Service(mockS3Client, bucketName);
    }

    @Test
    void testUploadFile_withNullBase64Image_throwsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            s3Service.uploadFile(null);
        });

        assertEquals("Base64 string cannot be null or empty.", exception.getMessage());
        verify(mockS3Client, never()).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    void testUploadFile_withInvalidBase64Format_throwsIOException() {
        String invalidBase64Image = "invalid-base64-data";

        IOException exception = assertThrows(IOException.class, () -> {
            s3Service.uploadFile(invalidBase64Image);
        });

        assertTrue(exception.getMessage().contains("Invalid Base64 format"));
        verify(mockS3Client, never()).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    void testUploadFile_withUnsupportedImageType_throwsIOException() {
        String unsupportedBase64Image = "data:image/bmp;base64,Qk32...";

        IOException exception = assertThrows(IOException.class, () -> {
            s3Service.uploadFile(unsupportedBase64Image);
        });

        assertEquals("Unsupported image type: image/bmp", exception.getMessage());
        verify(mockS3Client, never()).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    void testUploadFile_whenS3ExceptionOccurs_throwsIOException() {
        String base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU...";

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            s3Service.uploadFile(base64Image);
        });

        assertTrue(exception.getMessage().contains("Illegal base64 character 2e"));
    }

}
