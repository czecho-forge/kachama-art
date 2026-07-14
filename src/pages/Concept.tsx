import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";

export default function Concept() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Seo
        title="The Concept — Contemporary Thai Weaving Art | Kachama Art"
        description="Discover the concept behind Kachama's handwoven textile art: silk, natural and found materials woven with traditional hill-tribe patterns from Northern Thailand into contemporary wall hangings and tapestries."
        path="/concept"
      />
      <h1 className="text-3xl font-semibold tracking-[0.2em] sm:text-4xl">
        CONCEPT
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <Reveal className="overflow-hidden rounded-lg border border-border">
          <img
            src="/images/concept/concept-1.jpg"
            alt="Detail of Kachama Perez weaving silk and mixed fibers on the loom"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </Reveal>
        <Reveal
          delay={120}
          className="overflow-hidden rounded-lg border border-border"
        >
          <img
            src="/images/concept/concept-2.jpg"
            alt="Close-up of natural and synthetic weaving materials used in Kachama's textile art"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </Reveal>
        <Reveal
          delay={240}
          className="overflow-hidden rounded-lg border border-border"
        >
          <img
            src="/images/concept/concept-4.png"
            alt="Bamboo weaving tools on the loom"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </Reveal>
        <Reveal
          delay={360}
          className="overflow-hidden rounded-lg border border-border"
        >
          <img
            src="/images/concept/concept-3.png"
            alt="Woven detail evoking peacock feathers"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </Reveal>
      </div>

      <div className="mt-12 space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          The originality of Kachama's creations starts with her exuberant
          selection of materials. Using silk for the warp, she weaves all sorts
          of materials; not only natural and synthetic fibers but also metals,
          feathers, bamboo sticks and even dried food, depending on her inner
          landscapes. She might integrate into her weaving found material such
          as cans and plastic waste and poetically tackles modern subjects such
          as pollution.
        </p>
        <p>
          In other works, Kachama uses antique fabrics from the hill-tribe
          people in Northern Thailand. Sometimes she might juxtapose several
          different tribal patterns in the one piece, with each pattern
          encompassing the elements and stories intrinsic to that tribe.
        </p>
        <p>
          In this way, she has renewed this ancient form of craft bringing into
          a pure art form that acknowledges and honours the disappearing
          traditional culture while celebrating the contemporary world.
        </p>
        <p>
          Each detail, each material, each pattern is linked to Kachama's
          personal life struggles, love and passion, making every piece unique.
        </p>
        <p>
          Her creative approach to blending modern ideas with traditional
          weaving techniques has earned her art international recognition. Her
          works can be found in the collection of the Textile Museum in Lyon,
          France, acquired after an exhibition in 2008, The Hong Kong Museum
          Textiles Society, and The National Handicrafts and Hill Tribes Center
          (Taiwan). She has worked with several luxurious hotels and resorts,
          such as Sindhorn Midtown Hotel in Bangkok, Tamarind Village and Oasis
          Ban San Doi in Chiang Mai, and Crowne Plaza Hotel in Singapore. She
          was part of the prestigious exhibition Metissages during the La Fête
          Festival at the Jim Thompson Art Center in 2009.
        </p>
      </div>

      <div className="mt-16 space-y-6">
        <Reveal>
          <img
            src="/images/concept/soul-1.png"
            alt="Songs of My Soul handwoven wall hanging by Kachama Perez, full view"
            loading="lazy"
            className="w-full rounded-lg border border-border"
          />
        </Reveal>
        <Reveal delay={120}>
          <img
            src="/images/concept/soul-2.png"
            alt="Songs of My Soul handwoven wall hanging by Kachama Perez, detail view"
            loading="lazy"
            className="w-full rounded-lg border border-border"
          />
        </Reveal>
      </div>
    </section>
  );
}
