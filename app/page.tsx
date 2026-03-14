import Link from "next/link";
import { NavLink } from "@/components/NavLink";

export default function HomePage() {
  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-primary mt-4">
        Talk Abroad
      </h1>
      <p className="text-muted text-lg mt-3 leading-relaxed">
        海外で不自由なく話せる英語を、会話練習で身につけましょう。
      </p>
      <p className="text-muted text-sm mt-4 leading-relaxed">
        レストラン・ホテル・初対面の雑談・家族紹介・結婚式など、実際の場面に合わせたやりとりを練習できます。間違いを気にせず、まずは「話す」「返す」に慣れていくことを大切にしています。
      </p>

      <div className="mt-12 flex flex-col gap-4">
        <NavLink href="/scenarios">場面を選んで練習する</NavLink>
        <Link
          href="/free-talk"
          className="inline-flex items-center justify-center rounded-xl bg-accent text-white font-medium px-6 py-4 hover:opacity-90 tap-target min-h-[48px]"
        >
          設定を入力してAIフリートーク
        </Link>
        <Link
          href="/review"
          className="inline-flex items-center justify-center rounded-xl border-2 border-accent text-accent font-medium px-6 py-4 btn-secondary"
        >
          保存した表現を復習する
        </Link>
      </div>
    </div>
  );
}
