import { supabase } from './client';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Conversation {
  id: string;
  project_id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export async function createConversation(
  projectId: string,
  userId: string,
  title?: string
) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      project_id: projectId,
      user_id: userId,
      title,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Conversation;
}

export async function getProjectConversations(projectId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Conversation[];
}

export async function getConversation(conversationId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .maybeSingle();

  if (error) throw error;
  return data as Conversation | null;
}

export async function updateConversation(
  conversationId: string,
  updates: Partial<Conversation>
) {
  const { data, error } = await supabase
    .from('conversations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', conversationId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Conversation;
}

export async function deleteConversation(conversationId: string) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) throw error;
}

export async function addChatMessage(
  conversationId: string,
  userId: string,
  content: string,
  role: 'user' | 'assistant' | 'system',
  metadata?: Record<string, any>
) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      content,
      role,
      metadata: metadata || {},
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as ChatMessage;
}

export async function getConversationMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as ChatMessage[];
}
