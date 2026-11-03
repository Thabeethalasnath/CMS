package com.company.project.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "follow_up_queue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowUpItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "module_code", nullable = false, length = 50)
    private String moduleCode;

    @Column(name = "module_name", nullable = false, length = 100)
    private String moduleName;

    @Column(name = "module_sub", length = 150)
    private String moduleSub;

    @Column(name = "icon_bg", length = 50)
    private String iconBg;

    @Column(name = "icon_color", length = 50)
    private String iconColor;

    @Column(name = "item_count", nullable = false)
    private Integer count;

    @Column(name = "count_variant", length = 20)
    private String countVariant;

    @Column(name = "key_info_title", nullable = false, length = 200)
    private String keyInfoTitle;

    @Column(name = "key_info_sub", length = 200)
    private String keyInfoSub;

    @Column(nullable = false, length = 20)
    private String priority;

    @Column(nullable = false, length = 30)
    private String health;

    @Column(name = "days_since_last_follow_up", length = 50)
    private String daysSinceLastFollowUp;

    @Column(name = "days_color_red")
    private Boolean daysColorRed;

    @Column(name = "primary_action_label", length = 100)
    private String primaryActionLabel;

    @Column(name = "secondary_action_label", length = 100)
    private String secondaryActionLabel;

    @Column(name = "is_done", nullable = false)
    @Builder.Default
    private Boolean isDone = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.isDone == null) {
            this.isDone = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
