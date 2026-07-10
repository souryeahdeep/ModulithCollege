package org.college.attendance;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class QrJwtUtil {


    private static final String SECRET =
            "my-super-secret-key-for-qr-attendance-123456";

    private final Key key =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public String generateQrToken(AttendanceSession attendanceSession) {
        Map<String,Object> map = new HashMap<>();
        map.put("attendanceId",attendanceSession.getAttendanceId());
        map.put("branch",attendanceSession.getBranch());
        map.put("teacherName",attendanceSession.getTeacherName());
        map.put("group",attendanceSession.getGroupNo());
        map.put("section",attendanceSession.getSectionNo());
        return Jwts.builder()
                .claims(map)
                .expiration(
                        Date.from(attendanceSession.getExpiryTime().atZone(ZoneId.systemDefault()).toInstant())
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Map<String, Object> validateAndGetAttendanceId(String token) {

        try {
            Jws<Claims> claimsJws = Jwts.parser()
                    .verifyWith((SecretKey) key) // use the same key to verify HS256 signatures
                    .build()
                    .parseSignedClaims(token);
            Claims claims = claimsJws.getPayload();
            Map<String,Object> map = new HashMap<>();
            map.put("attendanceId",claims.get("attendanceId", String.class));
            map.put("classId",claims.get("classId", String.class));
            map.put("teacherId",claims.get("teacherId", String.class));
            map.put("group",claims.get("group", String.class));
            map.put("section",claims.get("section", String.class));
            map.put("semester",claims.get("semester", String.class));
            return map;

        } catch (JwtException ex) {
            // covers: expired, malformed, unsupported, signature invalid
            throw new RuntimeException("Invalid or expired QR code", ex);
        }
    }

}

