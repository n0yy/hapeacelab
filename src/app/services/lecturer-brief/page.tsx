"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

export default function LecturerBriefPage() {
  const mark = `## PSIKOLOGI REMAJA DAN PERMASALAHANNYA

<span className="bg-pink-200">Artikel ini membahas tentang psikologi remaja dan permasalahan yang mereka hadapi. Artikel ini menganalisis bagaimana remaja mengalami perubahan fisik dan mental selama masa pubertas dan bagaimana mereka berinteraksi dengan teman sebaya, keluarga, dan lingkungan mereka. Artikel ini juga memberikan beberapa tips dan strategi untuk mengatasi permasalahan remaja.</span>

### Rangkuman

Artikel ini membahas tentang psikologi remaja dan permasalahan yang mereka hadapi. Fase remaja adalah masa peralihan dari masa kanak-kanak menuju dewasa, di mana banyak perubahan fisik dan mental terjadi. Perubahan fisik meliputi pembesaran buah dada, pertumbuhan kumis, jenggot, dan perubahan suara, sedangkan perubahan mental meliputi pencapaian identitas diri, pemikiran logis, abstrak, dan idealistis. 

Masa remaja juga merupakan masa di mana remaja mulai berinteraksi dengan teman sebaya dan mengalami tekanan untuk mengikuti tren atau norma kelompok. Tekanan teman sebaya bisa positif atau negatif dan penting untuk orangtua dan guru untuk memberikan perhatian khusus pada remaja yang menunjukkan perilaku menyimpang seperti berbuat onar, mencuri, dan lain-lain. 

Permasalahan remaja juga dibahas dalam artikel ini, di mana masalah tersebut dapat dibagi menjadi empat kategori: penyalahgunaan obat, kenakalan remaja, masalah seksual, dan masalah terkait sekolah. Artikel ini juga membahas pentingnya peran orangtua, guru, dan lingkungan untuk membantu remaja dalam mengatasi permasalahan mereka dan memberikan beberapa tips untuk mengatasi masalah remaja. 

### Keywords 

- Puberty (👩‍🏫)
- Conformity (🤝)
- Identity (👤)
- Peer Pressure (👥)
- Social Interaction (🤝)
- Adolescence (👨‍🎓)
- Mental Health (🧠)
- Psychological Development (🧠)

### Key Insights 

- **Remaja membutuhkan dukungan dari orangtua dan guru untuk menghadapi tekanan teman sebaya.** (🤝🧠)
- **Permasalahan remaja dapat diatasi dengan dukungan dari orangtua, guru, dan lingkungan.** (🤝🧠)
- **Remaja perlu belajar mengelola emosi dan mengembangkan kemandirian.** (🧠👨‍🎓)
- **Perkembangan psikologi remaja sangat penting untuk dipahami agar dapat memberikan dukungan yang tepat.** (🧠👨‍🎓)

### Similar Articles or Paper 

- **"Psikologi Perkembangan Anak"** oleh **Jos Masdani**
- **"Psikologi Umum Dalam Lintasan Sejarah"** oleh **Alex Sobur**
- **"Pendidikan Karakter: Konsepsi dan Aplikasinya dalam Lembaga Pendidikan"** oleh **Zubaidi**
`;
  return (
    <>
      <div>LecturerBriefPage</div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        className="prose-sm md:prose mx-auto shadow-neo rounded-xl p-10 my-10 lg:mb-10 overflow-hidden"
      >
        {mark}
      </ReactMarkdown>
    </>
  );
}
