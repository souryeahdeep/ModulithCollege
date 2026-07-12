package org.college.attendance;

import lombok.Getter;
import lombok.Setter;


public record StudentScanRequest(
        String qrToken,
        String studentId,
        Double latitude,
        Double longitude
) {
}
