import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "../_lib/supabase/browserClient";
import { AUTH_CALLBACK_PATH } from "../constant";
import { useRouter } from "next/navigation";
import * as uuid from "uuid";

const supabase = getSupabase();

export const useUser = () => useQuery({
  queryKey: ['getUser'],
  queryFn: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    if (!user) throw new Error("unauthorized");

    const userId = user!.id;
    const avatarUrl = user!.identities![0].identity_data!.avatar_url;
    const name = user!.identities![0].identity_data!.full_name;

    return {
      userId,
      avatarUrl,
      name
    };
  }
});

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["getUser"] });
      push("login");
    }
  })
};

export const useSignInWithGithub = () => useMutation({
  mutationFn: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/${AUTH_CALLBACK_PATH}`,
      }
    });

    if (error) throw error;
  }
});

export const useDraftMessage = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const userId = user?.userId;

  return useMutation({
    mutationFn: async ({
      name,
      role,
      company,
      linkedinUrl,
      message,
    }: {
      name: string;
      role: string;
      company: string,
      linkedinUrl?: string,
      message: string,
    }) => {
      const leadId = uuid.v4();
      const createdAt = new Date();

      queryClient.setQueryData(["leadsMessages"], (oldData: any) => {
        return [
          {
            id: leadId,
            user_id: userId,
            name,
            role,
            company,
            linkedin_url: linkedinUrl,
            message,
            status: "draft",
            created_at: createdAt.toISOString()
          },
          ...oldData
        ];
      });

      const { error } = await supabase
        .from("leads")
        .insert({
          id: leadId,
          user_id: userId,
          name,
          role,
          company,
          linkedin_url: linkedinUrl,
          message,
          status: "draft",
          created_at: createdAt,
        });

      if (error) throw error;

      queryClient.refetchQueries({ queryKey: ["leadsMessages"] });
    }
  })
};

export const useLeadsMessages = () => useQuery({
  queryKey: ["leadsMessages"],
  queryFn: async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('leads')
      .select(`
          id,
          user_id,
          name,
          role,
          company,
          linkedin_url,
          created_at,
          message,
          status
        `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const useChangeLeadMessageStatus = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const userId = user?.userId;

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      queryClient.setQueryData(["leadsMessages"], (oldData: any) => {
        return oldData.map((item: any) => {
          if (item.id === id) {
            return { ...item, status };
          }
          return item;
        });
      });

      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      queryClient.refetchQueries({ queryKey: ["leadsMessages"] });
    }
  })
};

export const useDeleteLeadMessage = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const userId = user?.userId;

  return useMutation({
    mutationFn: async (id: string) => {
      queryClient.setQueryData(["leadsMessages"], (oldData: any) => {
        return oldData.filter((item: any) => item.id !== id);
      });

      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      queryClient.refetchQueries({ queryKey: ["leadsMessages"] });
    }
  })
}