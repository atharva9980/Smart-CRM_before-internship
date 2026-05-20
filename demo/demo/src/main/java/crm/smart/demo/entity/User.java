package crm.smart.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "crm_users") // 'users' is a reserved keyword in PostgreSQL
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password; // Note: In production, this MUST be hashed!
    
    @Column(nullable = false)
    private String role; // "CUSTOMER" or "AGENT"
}