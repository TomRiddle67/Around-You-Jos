export type BusinessSummary = {
  id:          string;
  name:        string;
  slug:        string;
  description: string;
  address:     string;
  phone:       string | null;
  whatsapp:    string | null;
  isVerified:  boolean;
  isFeatured:  boolean;
  neighborhood: { name: string; slug: string };
  category:    { name: string; slug: string; icon: string | null };
  images:      { url: string; alt: string | null }[];
};
