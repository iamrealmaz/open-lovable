import { supabase } from './client';

export interface ProjectFile {
  id: string;
  project_id: string;
  file_path: string;
  content: string;
  file_type: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export async function saveProjectFile(
  projectId: string,
  filePath: string,
  content: string,
  fileType: string
) {
  // Check if file exists
  const { data: existing, error: fetchError } = await supabase
    .from('project_files')
    .select('id, version')
    .eq('project_id', projectId)
    .eq('file_path', filePath)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    // Update existing file
    const { data, error } = await supabase
      .from('project_files')
      .update({
        content,
        version: existing.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as ProjectFile;
  } else {
    // Create new file
    const { data, error } = await supabase
      .from('project_files')
      .insert({
        project_id: projectId,
        file_path: filePath,
        content,
        file_type: fileType,
        version: 1,
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as ProjectFile;
  }
}

export async function getProjectFile(projectId: string, filePath: string) {
  const { data, error } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', projectId)
    .eq('file_path', filePath)
    .maybeSingle();

  if (error) throw error;
  return data as ProjectFile | null;
}

export async function getProjectFiles(projectId: string) {
  const { data, error } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', projectId)
    .order('file_path', { ascending: true });

  if (error) throw error;
  return (data || []) as ProjectFile[];
}

export async function deleteProjectFile(projectId: string, filePath: string) {
  const { error } = await supabase
    .from('project_files')
    .delete()
    .eq('project_id', projectId)
    .eq('file_path', filePath);

  if (error) throw error;
}

export async function getFileVersionHistory(
  projectId: string,
  filePath: string
) {
  const { data, error } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', projectId)
    .eq('file_path', filePath)
    .order('version', { ascending: false });

  if (error) throw error;
  return (data || []) as ProjectFile[];
}
