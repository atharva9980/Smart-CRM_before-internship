package crm.smart.demo.entity;


import jakarta.persistence.*;
import lombok.Data; // Assuming you added Lombok. If not, generate Getters/Setters manually.
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private String category; // e.g., BILLING, TECH_SUPPORT
    
    private String priority; // e.g., HIGH, MEDIUM, LOW
    
    private String status = "OPEN"; // Default status

    @Column(columnDefinition = "TEXT")
    private String aiDraftReply;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
