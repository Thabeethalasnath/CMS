package com.company.project.dashboard.mapper;

import com.company.project.dashboard.dto.CreateFollowUpItemRequest;
import com.company.project.dashboard.dto.FollowUpItemDto;
import com.company.project.dashboard.entity.FollowUpItem;
import org.springframework.stereotype.Component;

@Component
public class FollowUpItemMapper {

    public FollowUpItemDto toDto(FollowUpItem entity) {
        if (entity == null) {
            return null;
        }
        return FollowUpItemDto.builder()
                .id(entity.getId())
                .moduleCode(entity.getModuleCode())
                .moduleName(entity.getModuleName())
                .moduleSub(entity.getModuleSub())
                .iconBg(entity.getIconBg())
                .iconColor(entity.getIconColor())
                .count(entity.getCount())
                .countVariant(entity.getCountVariant())
                .keyInfoTitle(entity.getKeyInfoTitle())
                .keyInfoSub(entity.getKeyInfoSub())
                .priority(entity.getPriority())
                .health(entity.getHealth())
                .daysSinceLastFollowUp(entity.getDaysSinceLastFollowUp())
                .daysColorRed(entity.getDaysColorRed())
                .primaryActionLabel(entity.getPrimaryActionLabel())
                .secondaryActionLabel(entity.getSecondaryActionLabel())
                .isDone(entity.getIsDone())
                .notes(entity.getNotes())
                .orderIndex(entity.getOrderIndex())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public FollowUpItem toEntity(CreateFollowUpItemRequest request) {
        if (request == null) {
            return null;
        }
        return FollowUpItem.builder()
                .moduleCode(request.getModuleCode() != null ? request.getModuleCode() : generateModuleCode(request.getModuleName()))
                .moduleName(request.getModuleName())
                .moduleSub(request.getModuleSub())
                .iconBg(request.getIconBg() != null ? request.getIconBg() : "bg-[#EFF6FF]")
                .iconColor(request.getIconColor() != null ? request.getIconColor() : "#2563EB")
                .count(request.getCount())
                .countVariant(request.getCountVariant() != null ? request.getCountVariant() : "amber")
                .keyInfoTitle(request.getKeyInfoTitle())
                .keyInfoSub(request.getKeyInfoSub())
                .priority(request.getPriority())
                .health(request.getHealth())
                .daysSinceLastFollowUp(request.getDaysSinceLastFollowUp() != null ? request.getDaysSinceLastFollowUp() : "0 days")
                .daysColorRed(request.getDaysColorRed() != null ? request.getDaysColorRed() : false)
                .primaryActionLabel(request.getPrimaryActionLabel() != null ? request.getPrimaryActionLabel() : "Take Action")
                .secondaryActionLabel(request.getSecondaryActionLabel() != null ? request.getSecondaryActionLabel() : "Open Item")
                .isDone(false)
                .notes(request.getNotes())
                .build();
    }

    private String generateModuleCode(String moduleName) {
        if (moduleName == null) return "CUSTOM";
        return moduleName.toUpperCase().replaceAll("[^A-Z0-9]+", "_");
    }
}
