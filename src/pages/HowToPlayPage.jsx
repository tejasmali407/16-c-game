import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Body, HeadingMD, SmallText } from '@/components/ui/typography';
import { useMotionConfig } from '@/hooks/useMotionConfig';
import { useTranslation } from '@/hooks/useTranslation';
import { tutorialVideos } from '@/data/tutorialVideos';
import { Video, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

export function HowToPlayPage() {
  const { pageTransition } = useMotionConfig();
  const { t, language } = useTranslation();
  const videoData = tutorialVideos[language] || tutorialVideos.en;

  const sections = [
    {
      title: t('tutorialObjectiveTitle'),
      desc: t('tutorialObjectiveDesc'),
      icon: CheckCircle,
      accent: 'text-green-400 bg-green-500/10 border-green-500/20'
    },
    {
      title: t('tutorialGameplayTitle'),
      desc: t('tutorialGameplayDesc'),
      icon: BookOpen,
      accent: 'text-primary bg-primary/10 border-primary/20'
    },
    {
      title: t('tutorialStackTitle'),
      desc: t('tutorialStackDesc'),
      icon: HelpCircle,
      accent: 'text-accent bg-accent/10 border-accent/20'
    }
  ];

  return (
    <motion.div {...pageTransition} className="space-y-8 max-w-2xl mx-auto">
      <SectionTitle
        title={t('howToPlayTitle')}
        subtitle={t('howToPlaySubtitle')}
        align="center"
      />

      {/* Video section */}
      <div className="glass-card p-6 border border-border/40 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
          <Video className="h-4 w-4" />
          {t('videoTutorial')} - {videoData.title}
        </h3>
        
        {videoData.videoUrl ? (
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-border/30">
            <iframe
              className="w-full h-full"
              src={videoData.videoUrl}
              title={videoData.title}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-secondary/5 rounded-xl border border-dashed border-border/50">
            <Video className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <SmallText className="text-muted-foreground">
              {t('videoComingSoon')}
            </SmallText>
          </div>
        )}
      </div>

      {/* Rules content */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <article key={sec.title} className="glass-card glass-card-hover p-6 border border-border/40 flex flex-col sm:flex-row gap-4 items-start">
              <div className={`p-2.5 rounded-xl border ${sec.accent} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <HeadingMD>{sec.title}</HeadingMD>
                <Body className="text-muted-foreground leading-relaxed">{sec.desc}</Body>
              </div>
            </article>
          );
        })}
      </div>
    </motion.div>
  );
}
export default HowToPlayPage;
