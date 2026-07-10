package org.college.attendance;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;


@Component
public class StudentJwtUtil {

    private static final String SECRET =
            "student-auth-secret-key-1234567890"; // >= 32 chars

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));


    public String extractStudentId(String token) {
        String rawToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(rawToken)
                .getPayload();

        return claims.get("studentId", String.class);
    }


}
