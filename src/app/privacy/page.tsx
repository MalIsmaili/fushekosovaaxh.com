import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionaries";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.meta.privacy };
}

type Section = { heading: string; body: string[] };

// Long-form legal copy lives here rather than in the shared dictionaries.
const content: Record<Locale, { updated: string; intro: string; sections: Section[] }> = {
  sq: {
    updated: "Përditësuar më 30 tetor 2026",
    intro:
      "FushëkosovaBB është platforma e klubit të basketbollit KB Fushë Kosova Jr. për organizimin e stërvitjeve, ndeshjeve dhe skuadrave. Këtu shpjegojmë cilat të dhëna mbledhim, pse, dhe çfarë të drejtash ke.",
    sections: [
      {
        heading: "Çfarë të dhënash mbledhim",
        body: [
          "Për çdo llogari: emrin, email-in, rolin (trajner, lojtar ose prind) dhe fjalëkalimin, i cili ruhet vetëm i enkriptuar (hash) — askush nuk mund ta lexojë.",
          "Për lojtarët: grupmoshën dhe, nëse i plotëson, moshën, datën e lindjes, telefonin, numrin e fanellës, pozicionin, gjatësinë, peshën dhe foton e profilit. Ruajmë edhe prezencën në stërvitje dhe thirrjet në ndeshje.",
          "Për prindërit: lidhjen me llogarinë e fëmijës, të krijuar me kodin e ftesës.",
        ],
      },
      {
        heading: "Pse i përdorim",
        body: [
          "Vetëm për organizimin e ekipit: planifikimin e stërvitjeve dhe ndeshjeve, njoftimet me email për lojtarët dhe prindërit, dhe sigurinë e platformës. Nuk i shesim të dhënat dhe nuk i përdorim për reklama.",
        ],
      },
      {
        heading: "Kush i sheh",
        body: [
          "Trajneri sheh të dhënat e lojtarëve në grupet e klubit. Prindi sheh vetëm fëmijët që ka lidhur me llogarinë e tij. Lojtari sheh orarin e grupit të vet.",
          "Platforma mbështetet te ofrues shërbimesh për hostimin (Vercel), bazën e të dhënave dhe dërgimin e email-eve (Resend), të cilët i përpunojnë të dhënat vetëm në emër tonë.",
        ],
      },
      {
        heading: "Fëmijët",
        body: [
          "Shumica e lojtarëve janë të mitur. Lojtarët nën 16 vjeç duhet të regjistrohen me dijeninë dhe pëlqimin e një prindi ose kujdestari. Prindi mund të kërkojë në çdo kohë korrigjimin ose fshirjen e të dhënave të fëmijës.",
        ],
      },
      {
        heading: "Sa kohë i ruajmë",
        body: [
          "Të dhënat ruhen sa kohë që llogaria është aktive. Kur një llogari fshihet, fshihen edhe profili, prezenca dhe lidhjet me prindërit.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "Përdorim vetëm cookies të domosdoshme: një për të të mbajtur të kyçur dhe një për gjuhën që zgjodhe. Shfletuesi yt kujton edhe rolin me të cilin hyre herën e fundit. Nuk përdorim cookies reklamimi ose analitike.",
        ],
      },
      {
        heading: "Të drejtat e tua",
        body: [
          "Ke të drejtë t'i shohësh, t'i korrigjosh ose t'i fshish të dhënat e tua. Lojtarët mund ta ndryshojnë profilin vetë. Për çdo kërkesë tjetër ose për fshirjen e llogarisë, kontakto trajnerin e klubit.",
        ],
      },
    ],
  },
  en: {
    updated: "Updated 30 October 2026",
    intro:
      "FushëkosovaBB is the platform the KB Fushë Kosova Jr. basketball club uses to organize trainings, games and rosters. This page explains what data we collect, why, and what rights you have.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "For every account: your name, email, role (coach, player or parent) and password, which is only stored hashed — nobody can read it.",
          "For players: the group age and, if filled in, age, birth date, phone, jersey number, position, height, weight and profile photo. We also keep training attendance and game call-ups.",
          "For parents: the link to their child's account, created with the invite code.",
        ],
      },
      {
        heading: "Why we use it",
        body: [
          "Only to run the team: scheduling trainings and games, emailing players and parents about them, and keeping the platform secure. We don't sell your data or use it for advertising.",
        ],
      },
      {
        heading: "Who can see it",
        body: [
          "The coach sees the details of players in the club's groups. A parent only sees the children linked to their account. A player sees their own group's schedule.",
          "The platform relies on service providers for hosting (Vercel), the database and sending email (Resend), who process the data only on our behalf.",
        ],
      },
      {
        heading: "Children",
        body: [
          "Most players are minors. Players under 16 should sign up with the knowledge and consent of a parent or guardian. A parent can ask at any time for their child's data to be corrected or deleted.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Data is kept while the account is active. When an account is deleted, its profile, attendance and parent links are deleted with it.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We only use essential cookies: one to keep you logged in and one for the language you picked. Your browser also remembers the role you last logged in with. We don't use advertising or analytics cookies.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can see, correct or delete your data. Players can edit their own profile. For anything else, or to delete your account, contact the club's coach.",
        ],
      },
    ],
  },
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = await getDictionary();
  const page = content[locale];

  return (
    <>
      <header className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <Logo />
          FushëkosovaBB
        </Link>
        <LanguageToggle />
      </header>
      <main className="flex-1">
        <article className="container-page max-w-2xl py-12">
          <h1 className="text-3xl font-extrabold tracking-tight">{t.meta.privacy}</h1>
          <p className="mt-2 text-sm text-foreground/60">{page.updated}</p>
          <p className="mt-6 text-foreground/80">{page.intro}</p>
          {page.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-foreground/80">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
