package com.web.AutoTech.services.aws;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
public class S3Service {

    private static final Map<String, String> MIME_TYPE_TO_EXTENSION = createMimeTypeMap();

    private final S3Client s3Client;
    private final String bucketName;

    public S3Service(S3Client s3Client, @Value("${aws.s3.bucket-name}") String bucketName) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    public String uploadFile(String base64Image) throws IOException {
        if (base64Image == null || base64Image.isEmpty()) {
            throw new IllegalArgumentException("Base64 string cannot be null or empty.");
        }

        ImageInfo imageInfo = extractImageInfo(base64Image);

        final String fileName = UUID.randomUUID() + imageInfo.extension;

        byte[] fileBytes = Base64.getDecoder().decode(imageInfo.base64Data);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(imageInfo.contentType)
                .contentDisposition("inline")
                .build();

        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileBytes));
            return String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);
        } catch (S3Exception e) {
            throw new IOException("Failed to upload file to S3: " + e.awsErrorDetails().errorMessage(), e);
        }
    }

    private ImageInfo extractImageInfo(String base64Image) throws IOException {
        if (!base64Image.startsWith("data:image/")) {
            throw new IOException("Invalid Base64 format: missing image MIME type.");
        }

        int commaIndex = base64Image.indexOf(',');
        if (commaIndex == -1) {
            throw new IOException("Invalid Base64 format: missing data delimiter.");
        }

        String mimeTypeSection = base64Image.substring(0, commaIndex);
        String base64Data = base64Image.substring(commaIndex + 1);  // Evitar recriações de strings

        String contentType = mimeTypeSection.substring(mimeTypeSection.indexOf(':') + 1, mimeTypeSection.indexOf(';'));

        String extension = MIME_TYPE_TO_EXTENSION.get(contentType);
        if (extension == null) {
            throw new IOException("Unsupported image type: " + contentType);
        }

        return new ImageInfo(contentType, extension, base64Data);
    }

    private static Map<String, String> createMimeTypeMap() {
        return Map.of(
                "image/jpeg", ".jpg",
                "image/png", ".png",
                "image/gif", ".gif"
        ); // Torna o mapa imutável
    }

    private record ImageInfo(String contentType, String extension, String base64Data) {
    }
}
