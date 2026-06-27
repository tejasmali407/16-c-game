import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Body, SmallText, HeadingMD } from '@/components/ui/typography';
import { useTranslation } from '@/hooks/useTranslation';
import { feedbackTypes } from '@/data/feedbackTypes';
import { submitFeedback } from '@/services/feedbackService';
import { getBrowserInfo, getDeviceInfo } from '@/utils/deviceInfo';
import { useToast } from '@/context/ToastContext';
import { useGame } from '@/context/GameContext';

export function FeedbackModal({ isOpen, onClose, initialType }) {
  const { t, language } = useTranslation();
  const toast = useToast();
  
  // Try to safely access game state for mode
  let gameMode = null;
  try {
    const gameState = useGame();
    if (gameState && gameState.gameStatus !== 'setup') {
      gameMode = gameState.gameMode;
    }
  } catch (e) {
    // Ignored, GameContext might not be fully initialized or active
  }

  const [feedbackType, setFeedbackType] = useState(initialType || 'feedback');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial type and clear inputs when opening
  useEffect(() => {
    if (isOpen) {
      setFeedbackType(initialType || 'feedback');
      setRating(initialType === 'rate' ? 5 : 0);
      setMessage('');
      setName('');
      setEmail('');
    }
  }, [isOpen, initialType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (feedbackType === 'rate' && rating === 0) {
      toast.error(t('ratingRequired'));
      return;
    }
    
    if (!message.trim()) {
      toast.error(t('messageRequired'));
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t('emailInvalid'));
      return;
    }

    setIsSubmitting(true);

    const payload = {
      feedbackType,
      rating: rating > 0 ? rating : undefined,
      message: message.trim(),
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      language,
      deviceInfo: getDeviceInfo(),
      browser: getBrowserInfo(),
      gameMode: gameMode || 'N/A',
      appVersion: '1.0.0',
      timestamp: new Date().toISOString(),
    };

    try {
      await submitFeedback(payload);
      toast.success(t('feedbackSuccess'));
      onClose();
    } catch (error) {
      toast.error(t('feedbackError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal content container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-surface/95 p-6 shadow-glow-cyan backdrop-blur-xl z-10"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <HeadingMD className="mb-4 text-gradient-primary">
              {t('feedbackAndSupport')}
            </HeadingMD>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Feedback Type */}
              <div className="space-y-1.5">
                <Label htmlFor="feedback-type">{t('feedbackType')}</Label>
                <select
                  id="feedback-type"
                  value={feedbackType}
                  onChange={(e) => {
                    setFeedbackType(e.target.value);
                    if (e.target.value === 'rate' && rating === 0) {
                      setRating(5);
                    }
                  }}
                  className="w-full h-11 bg-background/50 border border-border/50 focus:border-primary rounded-xl px-4 py-2 text-foreground outline-none transition-colors text-sm"
                >
                  {feedbackTypes.map((type) => (
                    <option key={type.id} value={type.id} className="bg-surface text-foreground">
                      {type.icon} {type.label[language] || type.label.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Stars (1-5) */}
              <div className="space-y-1.5">
                <Label>{t('rating')}</Label>
                <div className="flex gap-2 text-2xl pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= rating
                            ? 'fill-accent text-accent drop-shadow-[0_0_4px_rgba(255,61,113,0.5)]'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Area */}
              <div className="space-y-1.5">
                <Label htmlFor="feedback-message">{t('message')}</Label>
                <textarea
                  id="feedback-message"
                  placeholder={feedbackType === 'bug' ? 'Describe the bug...' : 'Your message here...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-background/50 border border-border/50 focus:border-primary rounded-xl px-4 py-2.5 text-foreground text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <Label htmlFor="feedback-name">{t('nameOptional')}</Label>
                <Input
                  id="feedback-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="feedback-email">{t('emailOptional')}</Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex gap-3 pt-2">
                <AnimatedButton
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {t('cancel')}
                </AnimatedButton>
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('submitting') : t('submit')}
                </AnimatedButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
