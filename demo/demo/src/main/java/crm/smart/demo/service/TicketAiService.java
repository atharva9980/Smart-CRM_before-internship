package crm.smart.demo.service;

import crm.smart.demo.entity.Ticket;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.ai.ollama.api.OllamaOptions;

@Service
public class TicketAiService {

    private final ChatClient chatClient;
    
    // Notice: We removed the repository injection entirely. Keep the service focused on AI logic.

    public TicketAiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    // Notice: @Async and @Transactional have been removed
    public void analyzeAndCategorizeTicket(Ticket ticket) {
        String prompt = String.format(
            "Analyze this customer support ticket: '%s' - '%s'. " +
            "Categorize it strictly as exactly one of: [BILLING, TECH_SUPPORT, SALES, GENERAL]. " +
            "Determine the priority strictly as exactly one of: [LOW, MEDIUM, HIGH] based on customer frustration. " +
            "Reply ONLY with the category and priority separated by a comma, like this: CATEGORY,PRIORITY",
            ticket.getTitle(), ticket.getDescription()
        );

        try {
            // Force the ChatClient to use llama3, overriding any YAML configs
            String aiResponse = chatClient.prompt()
                              .user(prompt)
                              .options(OllamaOptions.create().withModel("llama3"))
                              .call()
                              .content();
            
            // Parse the response
            String[] parts = aiResponse.trim().split(",");
            if (parts.length == 2) {
                ticket.setCategory(parts[0].trim());
                ticket.setPriority(parts[1].trim());
            } else {
                setDefaults(ticket);
            }
        } catch (Exception e) {
            System.err.println("AI Call failed, using defaults: " + e.getMessage());
            setDefaults(ticket);
        }
    }

    private void setDefaults(Ticket ticket) {
        ticket.setCategory("GENERAL");
        ticket.setPriority("MEDIUM");
    }
}