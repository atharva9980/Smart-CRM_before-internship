package crm.smart.demo.controller;

import crm.smart.demo.entity.Ticket;
import crm.smart.demo.repository.TicketRepository;
import crm.smart.demo.service.TicketAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*") 
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketAiService ticketAiService; // Inject our new AI Service!

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + id));
    }

    @PostMapping
public Ticket createTicket(@RequestBody Ticket ticket) {
    // 1. The thread stops and waits for OpenAI to return the category/priority
    ticketAiService.analyzeAndCategorizeTicket(ticket);
    
    // 2. The enriched ticket is saved to the DB
    return ticketRepository.save(ticket);
    
    // 3. Postman receives the full, completed JSON
}
@DeleteMapping("/{id}")
public void deleteTicket(@PathVariable Long id) {
    ticketRepository.deleteById(id);
    System.out.println("✓ Ticket ID " + id + " has been resolved and deleted.");
}
}