package crm.smart.demo.controller;

import crm.smart.demo.entity.User;
import crm.smart.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows React to connect
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        // Force the first user to be an AGENT for testing, everyone else is a CUSTOMER
        if (userRepository.count() == 0) {
            user.setRole("AGENT");
        } else {
            user.setRole("CUSTOMER");
        }
        
        userRepository.save(user);
        user.setPassword(null); // Never send password back to frontend
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> credentials) {
        Optional<User> userOpt = userRepository.findByEmail(credentials.get("email"));
        
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(credentials.get("password"))) {
            User user = userOpt.get();
            user.setPassword(null); // Clear password before sending to React
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}