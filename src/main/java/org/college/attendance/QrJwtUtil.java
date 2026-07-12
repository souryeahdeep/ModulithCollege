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
        map.put("attendanceId",attendanceSession.getAttendanceId().toString());
        map.put("branch",attendanceSession.getBranch());
        map.put("teacherName",attendanceSession.getTeacherName());
        map.put("group",attendanceSession.getGroupNo());
        map.put("section",attendanceSession.getSectionNo());
        map.put("startTime",attendanceSession.getStartTime().toString());
        map.put("endTime",attendanceSession.getExpiryTime().toString());
        map.put("dayOfWeek",attendanceSession.getDayOfWeek());
        map.put("classRoomNo",attendanceSession.getClassroomNo());
        return Jwts.builder()
                .claims(map)
                .expiration(
                        Date.from(attendanceSession.getExpiryTime().atZone(ZoneId.systemDefault()).toInstant())
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validate(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

