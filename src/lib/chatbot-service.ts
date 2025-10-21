interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  action?: string;
  data?: any;
}

export class ChatbotService {
  private conversationState: any = {};
  private masterAgent = new (await import('./ai-agents')).MasterAgent();
  private salesAgent = new (await import('./ai-agents')).SalesAgent();
  private verificationAgent = new (await import('./ai-agents')).VerificationAgent();
  private underwritingAgent = new (await import('./ai-agents')).UnderwritingAgent();
  private sanctionAgent = new (await import('./ai-agents')).SanctionAgent();

  async processMessage(message: string, history: ChatMessage[]): Promise<ChatResponse> {
    const context = this.conversationState;
    
    try {
      const response = await this.masterAgent.processConversation(message, context);
      
      // Update conversation state
      if (response.data) {
        this.conversationState = { ...this.conversationState, ...response.data };
      }
      
      // Route to worker agents if needed
      if (response.nextAgent) {
        return await this.routeToAgent(response.nextAgent, message, context);
      }
      
      return {
        message: response.message,
        action: response.action,
        data: response.data
      };
    } catch (error) {
      return {
        message: "I apologize for the technical difficulty. Let me help you with your loan inquiry. What specific assistance do you need?"
      };
    }
  }

  private async routeToAgent(agentType: string, message: string, context: any): Promise<ChatResponse> {
    switch (agentType) {
      case 'sales':
        const salesResponse = await this.salesAgent.processLoanInquiry(context.application || {});
        return { message: salesResponse.message };
      case 'verification':
        const verificationResponse = await this.verificationAgent.verifyKYC(context.application || {});
        return { message: verificationResponse.message };
      case 'underwriting':
        const underwritingResponse = await this.underwritingAgent.evaluateEligibility(context.application || {});
        return { message: underwritingResponse.message };
      case 'sanction':
        const sanctionResponse = await this.sanctionAgent.generateSanctionLetter(context.application || {}, context.decision || {});
        return { message: sanctionResponse.message, action: sanctionResponse.action };
      default:
        return { message: "Let me connect you with the right specialist." };
    }
  }


}