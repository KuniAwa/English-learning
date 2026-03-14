# Talk Abroad - 海外で話せる英語

日本語話者の大人向け・会話中心の英語学習WebアプリのMVPです。  
単語暗記ではなく「実際に話す」「とっさに返す」「旅行や初対面で困らない」ことを重視しています。

## アプリ概要

- **想定ユーザー**: 日本語母語の大人、英語は読めるが会話で詰まりやすい方
- **学習方式**: 会話中心 + 旅行/実場面特化
- **主な場面**: レストラン、ホテル、初対面の雑談、家族紹介、結婚式

### 機能（MVP）

1. **ホーム** - アプリ説明、場面別練習・復習への導線
2. **場面選択** - 5シナリオをカード表示。各シナリオで **固定シナリオで練習** または **AIフリートーク** を選択可能
3. **会話練習（固定シナリオ）** - 相手のセリフに対して英語で入力（キーボード or 音声）→ 添削・言い換え・解説表示、ヒント・保存
4. **会話練習（AIフリートーク）** - AI が相手役として自然に返答。音声読み上げ・音声入力・任意で添削表示・保存・会話終了時の振り返り
5. **復習** - 保存した表現一覧（シーン名・自分の文・添削・自然な言い換え）

### 初期シナリオ（各5往復）

- Restaurant: 注文とおすすめを聞く
- Hotel: チェックイン
- Small Talk: 初対面の雑談
- Family Introduction: 家族紹介
- Wedding Event: 結婚式での会話

## 技術スタック

- **Next.js 14**（App Router）
- **TypeScript**
- **Tailwind CSS**
- **データ**: ローカルストレージ（保存した表現のみ。シナリオは固定JSON）
- **AI添削**: OpenAI API（会話練習のフィードバック。未設定時は固定データにフォールバック）
- **音声入力**: Web Speech API（SpeechRecognition）。話した英語をテキストに変換して入力可能
- **音声読み上げ**: Web Speech API（SpeechSynthesis）。相手役の英語を再生ボタンで読み上げ

## 環境変数

AI 添削を使う場合は、プロジェクトルートに `.env.local` を作成し、以下を設定してください。

```bash
# .env.local
OPENAI_API_KEY=sk-...
```

- 未設定の場合、会話練習では固定フィードバックが表示され、「フィードバックを取得できませんでした」ののちフォールバックされます。
- Vercel ではダッシュボードの **Settings → Environment Variables** で `OPENAI_API_KEY` を追加してください。

`.env.example` をコピーして `.env.local` にリネームし、値を入れて利用できます。

## ローカル起動方法

```bash
cd english-learning
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## デプロイ（GitHub → Vercel）

**Vercel** へのデプロイを前提とした構成です。iPhone で PWA として使うには、まず GitHub にコードを上げ、Vercel でデプロイして HTTPS の URL を用意します。

### 1. GitHub への追加

次のどちらかで進めます。

**パターン A: いまのフォルダ構成のまま（親フォルダが Git のルート）**

- リポジトリのルートが `Cursor`（`english-learning` の親）の場合:
  1. GitHub で新しいリポジトリを作成（例: `my-english-app`）。初期ファイルは追加しなくてよい。
  2. 親フォルダでターミナルを開き、まだリモートがなければ追加してプッシュ:
     ```bash
     cd "c:\Users\kunik\OneDrive\ドキュメント\Apps\Cursor"
     git remote add origin https://github.com/あなたのユーザー名/my-english-app.git
     git branch -M main
     git push -u origin main
     ```
  3. **Vercel では「Root Directory」を `english-learning` に設定**します（後述）。

**パターン B: english-learning だけを 1 リポジトリにする**

- `english-learning` だけを別リポジトリにしたい場合:
  1. GitHub で新しいリポジトリを作成（例: `talk-abroad`）。README 等は不要でよい。
  2. `english-learning` フォルダ内で Git を初期化してプッシュ:
     ```bash
     cd "c:\Users\kunik\OneDrive\ドキュメント\Apps\Cursor\english-learning"
     git init
     git add .
     git commit -m "Initial commit: Talk Abroad PWA"
     git branch -M main
     git remote add origin https://github.com/あなたのユーザー名/talk-abroad.git
     git push -u origin main
     ```
  3. **Vercel では Root Directory はそのまま**（指定しない）でよいです。

### 2. Vercel の設定

1. ** [vercel.com](https://vercel.com)** にログイン（GitHub アカウントで連携すると楽です）。
2. **Add New…** → **Project** を選び、**Import Git Repository** で先ほどプッシュしたリポジトリを選びます。
3. **Configure Project** で次を確認・設定します:
   - **Root Directory**: パターン A のときは **Edit** を押し、`english-learning` を指定。パターン B のときは変更不要。
   - **Framework Preset**: Next.js が自動検出されます。
   - **Build Command**: `npm run build`（デフォルトのままで可）。
   - **Output Directory**: 変更不要。
4. **Environment Variables** で、AI 添削を使う場合に変数を追加します:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: あなたの OpenAI API キー（`sk-...`）
   - **Environment**: Production（必要なら Preview にも同じ値を追加）。
5. **Deploy** をクリックしてデプロイを開始します。
6. 完了すると **https://〇〇〇.vercel.app** のような URL が発行されます。この URL を iPhone の Safari で開き、「ホーム画面に追加」すると PWA として使えます。

### 3. 今後の更新の流れ

- コードを直したら、Git でコミットして GitHub にプッシュすると、Vercel が自動でビルド・デプロイします。
- 環境変数（例: `OPENAI_API_KEY`）を変更しただけのときは、Vercel ダッシュボードの **Deployments** → 最新の **⋯** → **Redeploy** で再デプロイすると反映されます。

## ディレクトリ構成

```
english-learning/
├── app/
│   ├── api/ai-feedback/   # AI フィードバック API
│   ├── api/free-talk/     # AI フリートーク API
│   └── ...                # ページ・practice/[id]/free（AIフリートーク）・loading.tsx
├── components/       # UI（VoiceInput, AudioPlayer, ServiceWorkerRegister, OfflineBanner など）
├── public/
│   ├── manifest.json     # PWA マニフェスト
│   ├── sw.js             # Service Worker（オフライン案内）
│   ├── offline.html      # オフライン時フォールバック
│   └── icons/            # PWA アイコン（icon.svg 等）
├── data/
│   ├── scenarios.json
│   └── scenarioRoles.ts   # フリートーク用シーン・役割設定
├── lib/
│   ├── ai/           # feedbackService（添削）, freeTalkService（会話相手）
│   └── ...           # シナリオ・添削・ストレージ・sessionSummary
├── types/            # 型定義（feedback, freeTalk 等）
└── README.md
```

## 今回の改善内容（1回目）

UI/UX と操作性の改善を中心に実施しました。新機能の追加は行わず、既存のデータ構造は維持しています。

### モバイルUI
- iPhone で片手操作しやすいよう、ボタン・リンクの最小高さを 48px に統一
- 入力欄のフォントサイズを 16px に（iOS のズーム防止）
- 画面下部の余白を調整し、safe-area を考慮

### 会話画面
- 会話の流れが分かるよう、1ターンごとに「○/5」のラベルと区切りを表示
- 進行状況をプログレスバーと「2 / 5」の数値で表示
- 相手の発話・自分の入力・アドバイス・言い換え例・解説のまとまりを整理
- 「ヒントを見る」「次へ」「この表現を保存する」の操作を明確化
- 文言を「添削」→「アドバイス」など、責めないトーンに調整

### 場面選択画面
- 各シナリオにアイコンを追加（レストラン・ホテル・雑談・家族・結婚式）
- カテゴリ「旅行」「雑談・イベント」でグループ化し、一目で見分けやすく
- カードの余白と視認性を改善

### 復習画面
- シーン名をカード上部で強調し、重要表現がすぐ目に入るレイアウトに
- 空状態のときの案内文を、前向きで安心感のある表現に変更
- 「場面を選んで練習する」への導線をボタンで明確化

### 文言全般
- 学習を続けやすく、間違いを責めないトーンに統一
- 「アドバイス」「自然な言い換え例」など、大人向けで落ち着いた表現に調整

---

## 今回の改善内容（2回目）

学習体験の強化と、将来の AI 連携を見据えた構造改善を中心に実施しました。

### 復習体験の強化
- 復習画面で「見返すだけ」で終わらない「再練習」フローを追加
- 各カードで「状況」→「自分の文」→「もう一度、自然な言い方を考えてみる」→「答え（言い換え例）を見る」の流れで、軽く再練習できるようにした
- 保存時に相手の発話（partnerLine / partnerLineJa）も保存し、復習時に状況を再現して表示

### 保存機能の整理
- `SavedPhrase` に `SavedPhraseInput` を分離し、保存日時・シーン名・自分の文・添削・言い換えに加え、任意で `partnerLine` / `partnerLineJa` を保存
- `lib/storage.ts` で `storageService` オブジェクトを export。将来 Supabase に移行する場合は同じインターフェースを満たす実装に差し替える想定

### 会話ロジックの分離強化
- **scenario data**: `lib/scenarios.ts`（既存）
- **feedback service**: `lib/feedback.ts` — 添削・言い換え取得。将来 LLM API に差し替えるポイントとして JSDoc を追加
- **storage service**: `lib/storage.ts` — 保存表現の読込・保存・削除。Supabase 差し替え用
- **session management**: `lib/sessionService.ts` を新設。`recordPracticeStart` / `recordTurnComplete` / `recordPhraseSaved` のスタブを用意。将来の学習履歴分析や API 連携で実装

### 学習補助の追加
- 「別の言い方を見る」をラベルで明示し、言い換え例のフォントをやや大きく
- フィードバックに `tone`（formal / casual / neutral）を追加。シナリオ側で「丁寧な言い方」「カジュアルな言い方」などの補足を表示可能に
- ヒント表示を「よく使う表現の例」として整理し、見やすくした

### 将来拡張の準備
- README の「将来拡張の準備」に、各機能の差し替えポイントと実装の目安を追記

---

## 将来拡張の準備

以下は、次のフェーズで追加しやすい形で整理した差し替えポイントと実装の目安です。

| 機能 | 対象ファイル・層 | 実装の目安 |
|------|------------------|------------|
| **OpenAI API 連携** | `lib/feedback.ts` の `getFeedbackForTurn` | ユーザー入力とターン情報を LLM に送り、`Feedback` 型の JSON を返す API を呼ぶ。固定データはフォールバックや開発用に残す |
| **音声入力** | 会話練習画面の入力欄まわり | Web Speech API の `SpeechRecognition` で発話→テキスト。`ConversationTurn` に「マイクで入力」ボタンを追加し、`sessionService` に音声利用フラグを記録する想定 |
| **音声読み上げ** | 相手セリフ・言い換え例の表示部分 | Web Speech API の `speechSynthesis`。`FeedbackDisplay` や `ReviewCard` に「読み上げ」ボタンを追加。再生状態はコンポーネント or 共通 hook で管理 |
| **PWA 化** | ルートに `manifest.json`、`public` にアイコン | `next.config` で PWA プラグインを有効化するか、手動で Service Worker を登録。オフライン時はキャッシュしたシナリオのみ表示する方針が扱いやすい |
| **Supabase 保存** | `lib/storage.ts` | `getSavedPhrases` / `savePhrase` / `removeSavedPhrase` を、Supabase のテーブル（例: `saved_phrases`）に対する CRUD に差し替え。`SavedPhrase` 型はそのまま利用可能 |
| **学習履歴の分析** | `lib/sessionService.ts` | `recordPracticeStart` / `recordTurnComplete` / `recordPhraseSaved` 内で、Supabase や analytics に送信。テーブル例: `sessions`, `turn_logs`, `saved_phrase_logs` |

---

## AI 添削機能（第4フェーズ）

ユーザーの英語入力に対して、LLM（OpenAI）が実用的で優しいフィードバックを返します。文法試験のような厳しい添削ではなく、「そのままでも通じる」場合はそれを伝えつつ、自然な表現・短い言い方・丁寧な言い方を提示します。

### 返却内容（AIFeedback）

1. **良い点**（positive）— 通じる場合は明記
2. **改善ポイント**（improvement）— 最大2点
3. **より自然な表現**（natural）
4. **より短く言う言い方**（short）
5. **丁寧な言い方**（polite）
6. **日本語での短い解説**（explanationJa）

### 環境変数設定

| 変数名 | 説明 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI API キー（[API Keys](https://platform.openai.com/api-keys) で発行） |

- ローカル: `.env.local` に記載（git にコミットしない）
- Vercel: プロジェクト → Settings → Environment Variables で追加

### AI 連携アーキテクチャ

```
[会話練習画面]
    ↓ ユーザー送信
[POST /api/ai-feedback]
  body: { userInput, scenarioContext: { scenarioTitle, partnerLine, partnerLineJa } }
    ↓
[lib/ai/feedbackService.ts] getAIFeedback()
  - OPENAI_API_KEY を使用
  - プロンプト: 励まし・過度な添削禁止・自然なコミュニケーション重視
  - 応答: JSON（positive, improvement, natural, short, polite, explanationJa）
    ↓
[API Response] { ok: true, feedback: AIFeedback } or { ok: false, error }
    ↓
[UI] AIFeedbackDisplay で表示。エラー時は「フィードバックを取得できませんでした」＋固定フィードバックにフォールバック
```

- **UI からは API ルートのみ呼び出し**。`lib/ai/feedbackService` は API ルート（サーバー側）からのみ使用し、API キーをクライアントに露出しません。

---

## 音声入力機能

会話練習で、キーボード入力に加えて**マイクで話した英語をテキストに変換**して入力できます。海外での実際の会話に近い練習が可能です。

### 使い方

1. マイクボタン（Speak）を押す  
2. 英語で話す  
3. 音声がテキストに変換され、入力欄に表示される  
4. 必要ならテキストを編集  
5. 「次へ」で AI 添削へ送信  

### 対応ブラウザ

- **Chrome**（デスクトップ・Android）
- **iPhone Safari**（iOS 14.5 以降、`webkitSpeechRecognition`）

上記以外のブラウザでは音声入力は表示されず、テキスト入力のみ利用できます。

### マイク権限

- 初めて「Speak」を押したときに、ブラウザから**マイクへのアクセス許可**を求められます。許可すると音声認識が動作します。
- 許可しない、または「音声を認識できませんでした」と出る場合は、ブラウザの設定で当サイトのマイク権限を確認してください。
- 録音中は「録音中」インジケーターで状態が分かります。「再録音」でクリアしてやり直せます。

### コンポーネント

- `components/VoiceInput.tsx` — 音声録音・認識・テキスト出力。状態（recording / transcript / error）を管理し、認識結果を親の入力欄に渡します。

---

## 音声読み上げ機能（第6フェーズ）

相手役の英語を**音声で再生**できます。「相手の英語を聞く」→「自分が返す」という実践的な会話の流れを体験できます。

### 使い方

- 相手の発話の下にある **「再生」ボタン** を押すと、その英文を読み上げます。
- 再生中は「再生中」と表示され、「停止」で止められます。
- 読み上げ速度は少しゆっくりめ（rate 0.9）にしています。

### 利用しているブラウザ API

- **Web Speech API**
  - **SpeechSynthesis** / **SpeechSynthesisUtterance** — テキストの音声読み上げ（`lib/audioPlayback.ts`、`components/AudioPlayer.tsx`）
  - **SpeechRecognition**（音声入力）— 上記「音声入力機能」参照

### 対応しない場合のフォールバック

- `speechSynthesis` が使えない環境では、再生ボタンは**表示されません**。テキストのまま練習できます。
- 再生に失敗した場合は「音声を再生できませんでした」と表示します。

### コンポーネント・サービス

- `components/AudioPlayer.tsx` — 再生ボタン・再生中表示。将来 OpenAI TTS 等に差し替えやすいよう、再生ロジックは `lib/audioPlayback.ts` に分離しています。

---

## 聞き返し・セッション振り返り（第6フェーズ）

### 聞き返しフレーズ

- 会話画面に **「聞き返しフレーズを見る」** を追加。タップすると、そのシナリオで使いやすい表現（例: Could you say that again? / Could you speak more slowly? など）を表示します。
- 各フレーズは音声再生・**保存**が可能。復習一覧に追加して覚えられます。

### セッション完了時の振り返り

- 1シナリオを最後まで終えると、**振り返り**を表示します。
  - 今回保存した表現数
  - おすすめ復習（保存した表現の例）
  - 「保存した表現を復習する」「別の場面を練習する」への導線
- 学習の達成感と、次にやることを明確にします。

---

## AI フリートーク（第8フェーズ）

固定シナリオに加え、**AI が相手役として自然に返答する「AI フリートーク」** モードを追加しました。決められた正解を当てるのではなく、「通じる会話を続ける」体験を重視しています。

### AI Free Talk Mode の概要

- 場面選択で各シナリオに **「固定シナリオで練習」** と **「AIフリートーク」** の 2 つの導線があります。
- AI フリートークでは、選んだシーン（レストラン・ホテル・初対面・家族紹介・結婚式）に応じて AI が相手役になり、ユーザーの英語に合わせて自然に返答します。
- 相手の発話は音声読み上げ可能。入力は手入力または音声入力に対応しています。
- 必要に応じて **「添削を見る」** で AI 添削を表示し、**「このやりとりを保存」** で復習用に保存できます。
- **「会話を終了して振り返る」** でセッションを終え、保存数・おすすめ復習・次の導線を表示します。

### Fixed Scenario Mode との違い

| 項目 | 固定シナリオ | AI フリートーク |
|------|-------------|-----------------|
| 相手のセリフ | あらかじめ決まった順番 | ユーザーの内容に応じて変化 |
| ターン数 | 5 往復で終了 | ユーザーが終了するまで続く |
| 添削 | 毎ターン表示 | 任意で「添削を見る」 |
| 目的 | 定番フレーズの練習 | 通じる会話を続ける練習 |

### API 構成

- **POST /api/free-talk**  
  - リクエスト: `scenarioId`, `history`（直近の会話）, `userInput`  
  - レスポンス: `partnerReply`, `optionalHint`（任意）  
  - シーンごとの役割・目的・トーンは `data/scenarioRoles.ts` で定義し、システムプロンプトに渡しています。
- **POST /api/ai-feedback**  
  - フリートーク内で「添削を見る」を押したときに呼び出し。会話相手の返答とは別に、学習用フィードバックを取得します。

### 会話履歴の扱い

- 直近の会話（最大 20 メッセージ）を API に渡し、文脈を維持した返答を生成します。
- 履歴はセッション内でのみ保持し、ページを離れるとリセットされます（将来の長期記憶・同期は拡張案）。

### 今後の拡張案（フリートークまわり）

- **難易度調整** — シーンごとの difficulty や語彙レベルをユーザー設定で変更。
- **British English mode** — 相手役の英語をイギリス英語に切り替え。
- **Wedding / Travel special mode** — より長い会話や専門的な表現に対応したモード。
- **Long-term memory** — 過去セッションの要約を文脈に含める。
- **Personalized review** — フリートークでよく使った表現を復習リストで優先表示。

---

## PWA 対応（第7フェーズ）

このアプリは **PWA（Progressive Web App）** として利用できます。iPhone のホーム画面に追加すると、アプリのように起動し、オフライン時も最低限の案内が表示されます。

### PWA 対応の概要

- **Web App Manifest** — `public/manifest.json` でアプリ名・short_name（Talk Abroad）・スタンドアロン表示・テーマ色・アイコンを定義。
- **アイコン** — `public/icons/icon.svg` を配置。差し替え時はこのファイル（または 192/512px の PNG）を置き換えてください。
- **Service Worker** — `public/sw.js` でオフライン時は案内ページ（`/offline.html`）を表示。キャッシュ戦略はシンプル（ナビゲーション失敗時にフォールバック）。
- **iPhone 向けメタ** — `apple-mobile-web-app-capable`、`apple-touch-icon`、`theme-color`、`viewport-fit=cover` を設定。standalone 起動時は safe-area で余白を確保。

### iPhone でのホーム画面追加方法

1. Safari でこのアプリの URL を開く  
2. 画面下部の **共有** ボタン（□↑）をタップ  
3. **「ホーム画面に追加」** を選択  
4. 名前を確認（「Talk Abroad」）して **追加** をタップ  

追加後、ホーム画面のアイコンから起動すると、ブラウザの UI なしでアプリのように表示されます。

### オフライン時にできること / できないこと

| できること | できないこと |
|------------|----------------|
| オフライン案内ページの表示（再試行ボタン） | 新規の会話練習（AI 添削・音声は通信が必要） |
| 一度開いたページがキャッシュされていれば表示される可能性 | 音声入力・音声読み上げ（要ネットワーク） |
| 保存した復習データは端末の localStorage に残っており、**オンライン復帰後に**復習画面で利用可能 | 場面選択などサーバー配信コンテンツの取得 |

通信が不安定なときは画面上部に「オフラインです」の案内バナーが表示されます。AI 添削や音声が使えないときは、既存の「利用できませんでした」などのメッセージで案内しています。

### 現時点での制約

- **Web Push 通知は未実装**（復習リマインド等は今後の拡張）
- オフライン時は **案内ページ** を表示する構成。会話練習そのもののオフライン実行は未対応。
- キャッシュは **ナビゲーション失敗時のフォールバック** に留め、アプリ全体の事前キャッシュは行っていません（安定性優先）。
- アイコンは SVG のプレースホルダー。必要に応じて `public/icons/` に 192px / 512px の PNG を追加し、`manifest.json` の `icons` を差し替えてください。

### 保存データとの相性

- **ローカルストレージ**（保存した復習表現）は PWA でもそのまま利用できます。standalone 起動でも既存機能は変わりません。
- オフライン中は新規保存はできませんが、オンライン復帰後に保存・復習とも利用可能です。オフライン案内ページで「保存したデータは端末に残っています」と記載しています。

### 今後の拡張案（PWA まわり）

| 項目 | 内容 |
|------|------|
| **Web Push** | ブラウザの Push API でサーバーから通知。復習リマインドの送信に利用。 |
| **復習通知** | 「〇日ぶりです。復習しませんか？」など。Web Push または ローカル通知（予定時刻）と連携。 |
| **バックグラウンド同期** | Service Worker の Sync API で、オフライン中の操作をオンライン復帰後に送信。将来 Supabase 連携時に検討。 |
| **Supabase 連携** | 保存データをサーバーに移行。PWA から同じ API を叩く形にし、端末間でデータ共有可能に。 |
| **端末間同期** | Supabase 等でアカウント紐づけ後、複数端末で復習一覧・進捗を同期。 |

---

## 今後の拡張案（全体）

| 項目 | 内容 |
|------|------|
| **OpenAI TTS** | 相手役の読み上げをブラウザの SpeechSynthesis から OpenAI TTS に差し替え。`lib/audioPlayback.ts` を API 呼び出しに変更。 |
| **より自然な AI 会話生成** | シナリオに沿った相手の発話を LLM で生成し、固定テキストではなく毎回変化させる。 |
| **復習通知** | Web Push やローカル通知で「復習の時間です」を案内。 |
| **会話履歴分析** | `sessionService` で記録した開始・ターン完了・保存を集計し、学習傾向やおすすめ復習を表示。 |

---

## ライセンス

Private / 個人利用想定。
