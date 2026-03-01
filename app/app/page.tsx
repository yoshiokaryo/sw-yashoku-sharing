import Link from "next/link";
import Image from "next/image";
import { LpHeader } from "@/components/lp/LpHeader";
import { LpFooter } from "@/components/lp/LpFooter";
import PixelSnow from "@/components/lp/HeroBackground";
import { HeroTitle } from "@/components/lp/HeroTitle";
import { AnimatedSection, AnimatedStaggerContainer, AnimatedItem } from "@/components/lp/AnimatedSection";

const MERIT_ITEMS = [
  { text: "相場より安く\n購入できる", icon: "price" },
  { text: "夜食を\nワクワク体験に", icon: "heart" },
  { text: "栄養満点の食事を\nお手軽に", icon: "leaf" },
];
const STEPS = [
  { num: "①", text: "各種アプリストアでインストール", icon: "download" },
  { num: "②", text: "学生証で本人確認・アカウント登録", icon: "user" },
  { num: "③", text: "夜にアプリからの通知を受け取る", icon: "bell" },
  { num: "④", text: "駅前などに設置されたロッカーで受け取り", icon: "locker" },
];
const VOICES = [
  "昨日の夜、サラダとパンが198円で届いて助かった。コンビニより安くて満足です。",
  "賞味期限間近の惣菜を半額以下でゲット。味も全然問題なくてリピート決定しました。",
  "「さっぱり系」で検索したらおにぎりとサラダが提案されて、まさに欲しかった組み合わせだった。",
  "駅前ロッカーで受け取れるから帰り道に寄るだけでよくて、時間の節約にもなっています。",
  "余りものを買うことで食品ロス削減に参加できている感じがして、気持ちいいです。",
];

function MeritIcon({ type }: { type: string }) {
  const c = "w-7 h-7 md:w-8 md:h-8 mx-auto mb-2 text-lp-accent shrink-0";
  switch (type) {
    case "price":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "leaf":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        </svg>
      );
    case "bag":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case "chart":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      );
    case "heart":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "shield":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return null;
  }
}

function StepIcon({ type }: { type: string }) {
  const c = "w-5 h-5 text-gray-300";
  switch (type) {
    case "download":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    case "user":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "bell":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "locker":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function LpPage() {
  return (
    <div className="w-full pb-12 bg-black text-gray-100 lp-dark px-5 py-2 md:px-6 md:py-0">
      {/* ヒーロー: モバイルは縦積み、md以上で左右 */}
      <section className="relative min-h-[80vh] py-6 pb-8 rounded-b-[2rem] overflow-hidden bg-gray-900 -mx-5 md:mx-0">
        <div className="relative z-10 px-5 md:px-6">
          <LpHeader />
          <PixelSnow 
            color="#ffffff"
            flakeSize={0.02}
            minFlakeSize={1.25}
            pixelResolution={300}
            speed={0.6}
            density={0.3}
            direction={125}
            brightness={1}
            depthFade={8}
            farPlane={20}
            gamma={0.4545}
            variant="snowflake"
          />
          <HeroTitle
            title="レス飯"
            tagline="レスに、レスキュー!!"
            leftBubbles={
              <>
                <div className="lp-bubble-tail lp-bubble-tail-1 bg-gray-800 rounded-2xl px-4 py-3.5 border border-gray-600 text-[15px] leading-relaxed text-gray-200 relative">
                  あああ今日もたくさん余ってしまったな。
                </div>
                <div className="lp-bubble-tail lp-bubble-tail-2 bg-gray-800 rounded-2xl px-4 py-3.5 border border-gray-600 text-[15px] leading-relaxed text-gray-200 relative">
                  これ、誰かにとどけられないかな。
                </div>
              </>
            }
            rightBubble={
              <div className="lp-bubble-tail lp-bubble-tail-r bg-gray-800 rounded-2xl px-4 py-3.5 border border-gray-600 text-[30px] leading-relaxed font-bold text-lp-accent relative">
                え、これ安。
              </div>
            }
          />
        </div>
      </section>

      {/* アプリ: モバイルはテキスト→端末の順、mdで横並び */}
      <AnimatedSection className="py-8 md:py-10 my-6 bg-white rounded-2xl px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-center mb-2 text-black flex items-center justify-center gap-2">
          <svg className="w-6 h-6 md:w-7 md:h-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
          アプリ版
        </h2>
        <div className="flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center md:gap-8 py-4">
          <div className="w-full md:flex-1 md:min-w-[260px] text-center md:text-left">
            <h3 className="text-[2.5rem] md:text-[4rem] font-bold m-0 mb-1 text-black leading-tight">レス飯</h3>
            <p className="text-gray-500 text-[15px] md:text-sm mb-5 leading-relaxed">2026年6月リリース予定</p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
              <a href="#" className="group flex items-center gap-3 w-[170px] h-[52px] px-4 rounded-lg bg-black text-white border border-gray-700 hover:bg-gray-900 transition-all duration-200 active:scale-95 no-underline" aria-label="Download on the App Store">
                <svg className="w-7 h-7 fill-current shrink-0" viewBox="0 0 384 512" aria-hidden>
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-19-81.6-18.6-38.2.6-73.3 20.4-93 54.8-40.1 70.1-10.2 174.5 28.5 230.3 19 27.2 41.5 57.4 71.1 56.3 28.3-1.1 38.9-18.1 73.1-18.1 33.7 0 43.3 18.1 73.1 17.6 30.1-.5 49.3-27.2 67.9-54.3 21.3-31.2 30-61.5 30.2-63.1-.7-.2-58.7-22.5-58.9-87.3zM245.9 89.1c15.3-18.3 25.4-43.9 22.6-69.1-22.3 1-49.1 14.8-65.1 33.3-14.3 16.4-26.8 42.4-23.4 67.3 24.8 2 49.9-13.3 65.9-31.5z" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] font-medium mb-0.5">Download on the</span>
                  <span className="text-sm font-semibold tracking-tight">App Store</span>
                </div>
              </a>
              <a href="#" className="group flex items-center gap-3 w-[170px] h-[52px] px-4 rounded-lg bg-black text-white border border-gray-700 hover:bg-gray-900 transition-all duration-200 active:scale-95 no-underline" aria-label="GET IT ON Google Play">
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 512 512" aria-hidden>
                  <path fill="#00df9a" d="M48 448V64c0-14.1 8-26.3 19.8-32.4l246.3 246.3L48 524.4c-11.8-6.1-19.8-18.3-19.8-32.4z" />
                  <path fill="#00b0ff" d="M464.4 256c0 14.1-8 26.3-19.8 32.4L314.1 278.5 48 448l246.3-246.3 170.1 86.7c11.8 6.1 19.8 18.3 19.8 32.4z" />
                  <path fill="#ff3d00" d="M464.4 256c0-14.1-8-26.3-19.8-32.4L314.1 233.5 48 64l246.3 246.3 170.1-86.7c11.8-6.1 19.8-18.3-19.8-32.4z" />
                  <path fill="#ffeb3b" d="M314.1 278.5l-69.8-69.8 69.8-69.8 130.5 66.4c11.8 6.1 19.8 18.3 19.8 32.4s-8 26.3-19.8 32.4L314.1 278.5z" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] font-medium mb-0.5">GET IT ON</span>
                  <span className="text-sm font-semibold uppercase">Google Play</span>
                </div>
              </a>
            </div>
          </div>
          <div className="w-[180px] h-[340px] md:w-[200px] md:h-[380px] rounded-[1.75rem] p-3 bg-gray-800 border border-gray-600 shrink-0">
            <div className="w-full h-full rounded-[1.25rem] p-2.5 md:p-3 bg-gray-900 text-[0.6rem] md:text-[0.7rem] border border-gray-700 flex flex-col overflow-hidden">
              {/* 画面上部: タイトル */}
              <div className="text-center py-1.5 border-b border-gray-700 text-gray-300 font-bold text-[0.7rem] md:text-[0.75rem] shrink-0">
                今日のメニュー
              </div>
              {/* メニュー選択リスト */}
              <div className="flex-1 overflow-y-auto space-y-1.5 mt-2">
                <label className="flex items-center gap-2 py-2 px-2 rounded-lg bg-gray-800 border border-gray-600 cursor-pointer hover:border-lp-accent/50">
                  <input type="checkbox" defaultChecked className="rounded border-gray-500 text-lp-accent" />
                  <span className="flex-1 text-gray-200">サラダ</span>
                  <span className="text-lp-accent font-bold">¥88</span>
                </label>
                <label className="flex items-center gap-2 py-2 px-2 rounded-lg bg-gray-800 border border-gray-600 cursor-pointer hover:border-lp-accent/50">
                  <input type="checkbox" className="rounded border-gray-500 text-lp-accent" />
                  <span className="flex-1 text-gray-200">パン</span>
                  <span className="text-lp-accent font-bold">¥50</span>
                </label>
                <label className="flex items-center gap-2 py-2 px-2 rounded-lg bg-gray-800 border border-gray-600 cursor-pointer hover:border-lp-accent/50">
                  <input type="checkbox" className="rounded border-gray-500 text-lp-accent" />
                  <span className="flex-1 text-gray-200">おにぎり</span>
                  <span className="text-lp-accent font-bold">¥100</span>
                </label>
                <label className="flex items-center gap-2 py-2 px-2 rounded-lg bg-gray-800 border border-gray-600 cursor-pointer hover:border-lp-accent/50">
                  <input type="checkbox" className="rounded border-gray-500 text-lp-accent" />
                  <span className="flex-1 text-gray-200">惣菜</span>
                  <span className="text-lp-accent font-bold">¥120</span>
                </label>
              </div>
              {/* 下部: カートボタン */}
              <div className="pt-2 mt-auto border-t border-gray-700 shrink-0">
                <button type="button" className="w-full py-2 rounded-lg bg-lp-accent text-white font-bold text-[0.7rem] md:text-[0.75rem]">
                  カートへ
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* メリット: モバイル2列→mdで3列、最大幅で中央 */}
      <AnimatedSection className="py-8 md:py-10" id="merit">
        <h2 className="text-xl md:text-2xl font-extrabold text-center mb-5 md:mb-6 text-gray-200 leading-tight flex items-center justify-center gap-2">
          <svg className="w-6 h-6 md:w-7 md:h-7 text-lp-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          メリット
        </h2>
        <AnimatedStaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-[560px] mx-auto">
          {MERIT_ITEMS.map(({ text, icon }, i) => (
            <AnimatedItem key={text} index={i}>
              <div className="bg-gray-900 border border-gray-700 rounded-xl md:rounded-2xl p-3.5 md:p-4 text-center font-bold text-[13px] md:text-sm leading-snug text-gray-200 whitespace-pre-line flex flex-col items-center">
                <MeritIcon type={icon} />
                <span>{text}</span>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStaggerContainer>
      </AnimatedSection>

      {/* 使い方: モバイル2列→mdで4列横並び */}
      <AnimatedSection className="py-8 md:py-10">
        <h2 className="text-xl md:text-2xl font-extrabold text-center mb-5 md:mb-6 text-gray-200 leading-tight flex items-center justify-center gap-2">
          <svg className="w-6 h-6 md:w-7 md:h-7 text-lp-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          使い方
        </h2>
        <AnimatedStaggerContainer className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:justify-center md:max-w-[720px] md:mx-auto">
          {STEPS.map(({ num, text, icon }, i) => (
            <AnimatedItem key={num} index={i}>
              <div className="text-center min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-full bg-gray-700 text-gray-200 flex flex-col items-center justify-center gap-0.5 font-extrabold text-base md:text-lg border border-gray-600">
                  <StepIcon type={icon} />
                  <span className="text-[10px] md:text-xs leading-none">{num}</span>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-3.5 text-[13px] md:text-sm leading-snug text-gray-200">{text}</div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStaggerContainer>
      </AnimatedSection>

      {/* SDGs 貢献 */}
      <AnimatedSection className="py-8 md:py-10">
        <h2 className="text-xl md:text-2xl font-extrabold text-center mb-5 md:mb-6 text-gray-200 leading-tight flex items-center justify-center gap-2">
          <svg className="w-6 h-6 md:w-7 md:h-7 text-lp-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          簡単にSDGsに貢献
        </h2>
        <div className="max-w-[560px] mx-auto text-center">
          <Image
            src="/sdgs-logo.png"
            alt="Sustainable Development Goals"
            width={320}
            height={120}
            className="mx-auto mb-4 w-48 md:w-64 h-auto"
          />
          <p className="text-[15px] md:text-base leading-relaxed text-gray-300">
            食品ロスを減らすことで、<strong className="text-gray-200">SDGs（持続可能な開発目標）</strong>に貢献できます。レス飯は「つくる責任 つかう責任」「飢餓をゼロに」など、世界の目標達成に寄与するサービスです。
          </p>
        </div>
      </AnimatedSection>

      {/* お客様の声: モバイル1列→sm2列→md3列 */}
      <AnimatedSection className="py-8 md:py-10">
        <h2 className="text-xl md:text-2xl font-extrabold text-center mb-5 md:mb-6 text-gray-200 leading-tight">良いという声たくさん!</h2>
        <AnimatedStaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-[720px] mx-auto">
          {VOICES.map((msg, i) => (
            <AnimatedItem key={msg} index={i}>
              <div>
                <div className="lp-voice-arrow bg-gray-800 rounded-2xl px-4 py-4 border border-gray-600 text-[15px] leading-relaxed text-gray-200 relative">{msg}</div>
                <div className="w-10 h-10 mt-2 mx-auto rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStaggerContainer>
      </AnimatedSection>

      {/* CTA: タップ領域 44px 確保 */}
      <AnimatedSection className="py-8 md:py-10 text-center">
        <Link
          href="/app"
          className="inline-flex items-center justify-center min-h-[48px] py-3 px-6 md:px-8 rounded-lg bg-lp-accent text-white font-bold text-base md:text-lg no-underline hover:opacity-90 w-full sm:w-auto"
        >
          ログインしてメニューへ
        </Link>
      </AnimatedSection>

      <LpFooter />
    </div>
  );
}
