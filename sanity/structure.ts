import type { StructureResolver } from "sanity/structure";
import { CircleCheck, Cog, FileText, Home, Info, Mail, MessageSquareQuote, Newspaper, Shield, Stethoscope, Wallet, Layers } from "lucide-react";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string, icon: React.ComponentType) =>
  S.listItem().title(title).id(type).icon(icon).child(S.document().schemaType(type).documentId(type).title(title));

/** Sidebar: Settings, Pages, Services, Blog posts, Reviews. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Diamond Dental Group")
    .items([
      singleton(S, "siteSettings", "Site settings", Cog),
      S.listItem()
        .title("Pages")
        .icon(Layers)
        .child(
          S.list()
            .title("Pages")
            .items([
              singleton(S, "homePage", "Home", Home),
              singleton(S, "aboutPage", "About", Info),
              singleton(S, "servicesPage", "Services hub", Stethoscope),
              singleton(S, "patientCarePage", "Patient Care", Wallet),
              singleton(S, "blogPage", "Patient Education", Newspaper),
              singleton(S, "contactPage", "Contact", Mail),
              singleton(S, "privacyPage", "Privacy policy", Shield),
              singleton(S, "thankYouPage", "Thank you", CircleCheck),
            ]),
        ),
      S.divider(),
      S.listItem().title("Services").icon(FileText).child(S.documentTypeList("service").title("Services").defaultOrdering([{ field: "order", direction: "asc" }])),
      S.listItem().title("Blog posts").icon(Newspaper).child(S.documentTypeList("post").title("Blog posts").defaultOrdering([{ field: "date", direction: "desc" }])),
      S.listItem().title("Reviews").icon(MessageSquareQuote).child(S.documentTypeList("testimonial").title("Reviews")),
    ]);
