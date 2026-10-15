export const CONTACT_REASONS = ['Regarding an Opportunity', 'Need help in Project/Idea', 'Query regarding Topic/Tech', 'Need Guidance', 'Meet in-person', 'Others'];
export interface ContactDetails { name: string; email: string; reason: string; message: string }
export interface ContactState { step: 'name' | 'email' | 'reason' | 'message' | 'confirm'; details: Partial<ContactDetails> }
interface ContactResult { state: ContactState | null; text: string; submit?: ContactDetails }
export function advanceContact(state: ContactState | null, input: string): ContactResult {
  const value = input.trim();
  if (/^(cancel|stop)$/i.test(value)) return { state: null, text: 'Contact cancelled. You can keep asking portfolio questions.' };
  if (!state) return { state: { step: 'name', details: {} }, text: 'I can send a message to Aarsh. You can type cancel at any time. What is your name?' };
  const details = { ...state.details };
  const next = (step: ContactState['step'], text: string): ContactResult => ({ state: { step, details }, text });
  switch (state.step) {
    case 'name':
      if (!value || value.length > 100) return { state, text: 'Please enter a name between 1 and 100 characters.' };
      details.name = value;
      return next('email', 'What email address can Aarsh reply to?');
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254) return { state, text: 'Please enter a valid email address.' };
      details.email = value;
      return next('reason', 'Select a reason for contacting Aarsh. [REASON_DROPDOWN]');
    case 'reason':
      if (!CONTACT_REASONS.includes(value)) return { state, text: 'Please select one of the reasons. [REASON_DROPDOWN]' };
      details.reason = value;
      return next('message', 'What message would you like to send?');
    case 'message':
      if (!value || value.length > 3000) return { state, text: 'Please enter a message between 1 and 3000 characters.' };
      details.message = value;
      return next('confirm', `Please review your message:\n\nName: ${details.name}\n\nEmail: ${details.email}\n\nReason: ${details.reason}\n\nMessage: ${details.message}\n\nType send to submit, or cancel to discard.`);
    case 'confirm':
      if (!/^(send|retry)$/i.test(value)) return { state, text: 'Type send to submit this message, or cancel to discard it.' };
      return { state, text: 'Sending your message…', submit: details as ContactDetails };
  }
}
export const isContactIntent = (text: string) => /\b(contact|hire|hiring|reach out|send (?:a )?message|leave (?:a )?message|get in touch)\b/i.test(text);
