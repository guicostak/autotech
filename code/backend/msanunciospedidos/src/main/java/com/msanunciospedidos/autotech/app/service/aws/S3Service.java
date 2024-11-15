package com.msanunciospedidos.autotech.app.service.aws;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class S3Service {

    private final S3Client s3Client;
    private final String bucketName;

    public S3Service(S3Client s3Client,
                     @Value("${aws.s3.bucket-name}")
                     String bucketName) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    @Async
    public CompletableFuture<String> uploadFile(MultipartFile file) throws IOException {
        final var fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        final var putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .contentDisposition("inline")
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        final var fileUrl = String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);

        return CompletableFuture.completedFuture(fileUrl);
    }

    @Async
    public CompletableFuture<Void> deleteFile(String fileName) {
        final var deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        s3Client.deleteObject(deleteObjectRequest);

        return CompletableFuture.completedFuture(null);
    }
}
