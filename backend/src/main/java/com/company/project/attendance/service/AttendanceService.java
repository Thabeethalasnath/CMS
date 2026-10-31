package com.company.project.attendance.service;

import com.company.project.attendance.entity.AttendanceEntity;
import com.company.project.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    @Transactional(readOnly = true)
    public List<AttendanceEntity> getAllAttendance() {
        return attendanceRepository.findAllByOrderByIdDesc();
    }

    @Transactional(readOnly = true)
    public Optional<AttendanceEntity> getAttendanceById(String id) {
        return attendanceRepository.findById(id);
    }

    @Transactional
    public AttendanceEntity createAttendance(AttendanceEntity record) {
        if (record.getId() == null || record.getId().trim().isEmpty()) {
            long count = attendanceRepository.count();
            record.setId(String.format("ATT-%06d", count + 1));
        }
        return attendanceRepository.save(record);
    }

    @Transactional
    public AttendanceEntity updateAttendance(String id, AttendanceEntity updates) {
        AttendanceEntity existing = attendanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Attendance record not found: " + id));

        if (updates.getAttendanceDate() != null) existing.setAttendanceDate(updates.getAttendanceDate());
        if (updates.getEmployeeId() != null) existing.setEmployeeId(updates.getEmployeeId());
        if (updates.getEmployeeName() != null) existing.setEmployeeName(updates.getEmployeeName());
        if (updates.getAvatarInitials() != null) existing.setAvatarInitials(updates.getAvatarInitials());
        if (updates.getAvatarColor() != null) existing.setAvatarColor(updates.getAvatarColor());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getCheckIn() != null) existing.setCheckIn(updates.getCheckIn());
        if (updates.getCheckOut() != null) existing.setCheckOut(updates.getCheckOut());
        if (updates.getWorkHours() != null) existing.setWorkHours(updates.getWorkHours());
        if (updates.getOvertimeHours() != null) existing.setOvertimeHours(updates.getOvertimeHours());
        if (updates.getWorkMinutes() != null) existing.setWorkMinutes(updates.getWorkMinutes());
        if (updates.getOvertimeMinutes() != null) existing.setOvertimeMinutes(updates.getOvertimeMinutes());
        if (updates.getDayType() != null) existing.setDayType(updates.getDayType());
        if (updates.getIsLate() != null) existing.setIsLate(updates.getIsLate());
        if (updates.getHasOvertime() != null) existing.setHasOvertime(updates.getHasOvertime());
        if (updates.getNotes() != null) existing.setNotes(updates.getNotes());

        return attendanceRepository.save(existing);
    }

    @Transactional
    public void deleteAttendance(String id) {
        attendanceRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMetrics() {
        long total = attendanceRepository.count();
        long present = attendanceRepository.countByStatusIgnoreCase("Present");
        long late = attendanceRepository.countByIsLateTrue();
        Long otMinutes = attendanceRepository.sumOvertimeMinutes();
        double otHours = (otMinutes != null ? otMinutes : 0L) / 60.0;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRecords", total);
        metrics.put("totalRecordsTrend", "↑ 12% vs last month");
        metrics.put("presentRecords", present);
        metrics.put("presentRecordsTrend", "↑ 8% vs last month");
        metrics.put("lateRecords", late);
        metrics.put("lateRecordsTrend", "↓ 18% vs last month");
        metrics.put("totalOvertimeHours", String.format("%.1f", otHours));
        metrics.put("totalOvertimeHoursTrend", "↑ 25% vs last month");

        return metrics;
    }
}
