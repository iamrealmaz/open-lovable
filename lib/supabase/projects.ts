import { supabase } from './client';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
  sandbox_id?: string;
  sandbox_provider?: 'vercel' | 'e2b';
  sandbox_url?: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export async function createProject(
  userId: string,
  name: string,
  description?: string,
  metadata?: Record<string, any>
) {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name,
      description,
      status: 'active',
      metadata: metadata || {},
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Project;
}

export async function getProject(projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data as Project | null;
}

export async function getUserProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Project[];
}

export async function updateProject(
  projectId: string,
  updates: Partial<Project>
) {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}

export async function archiveProject(projectId: string) {
  return updateProject(projectId, { status: 'archived' });
}

export async function updateProjectSandbox(
  projectId: string,
  sandboxId: string,
  sandboxProvider: 'vercel' | 'e2b',
  sandboxUrl?: string
) {
  return updateProject(projectId, {
    sandbox_id: sandboxId,
    sandbox_provider: sandboxProvider,
    sandbox_url: sandboxUrl,
  });
}
