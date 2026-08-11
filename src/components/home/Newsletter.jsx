import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, CheckCircle2, Send } from 'lucide-react';
import { LayoutContainer } from '../layout/LayoutContainer';
import { useLanguage } from '../../context/LanguageContext';

export const Newsletter = memo(function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-14 bg-white">
      <LayoutContainer>
        <div className="relative bg-gradient-to-r from-[#0E2A5A] via-[#1E3A6A] to-[#5A3418] rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-12 text-white">
          
          {/* Decorative Subtle Elements */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 bg-[#5A3418] border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full uppercase shadow-md">
              <Sparkles size={13} className="text-amber-400" />
              <span>{t('newsletterTag')}</span>
            </div>

            {/* Main Title & Subtitle */}
            <h2 className="text-xl sm:text-4xl font-black tracking-tight leading-snug">
              {t('newsletterTitle')}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto font-medium leading-relaxed">
              {t('newsletterSubtitle')}
            </p>

            {/* Form Box */}
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-600/90 text-white font-extrabold text-xs sm:text-sm p-4 rounded-2xl border border-emerald-400/40 inline-flex items-center gap-2 shadow-xl text-left sm:text-center"
              >
                <CheckCircle2 size={20} className="shrink-0" />
                <span>Thank you for subscribing! Check your inbox for weekly Korean offer alerts.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2.5 sm:gap-2 bg-white/10 backdrop-blur-md p-2 sm:p-1.5 rounded-2xl sm:rounded-full border border-white/20 shadow-xl w-full">
                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 sm:py-2 w-full bg-white/10 sm:bg-transparent rounded-xl sm:rounded-none">
                  <Mail size={18} className="text-amber-400 shrink-0" />
                  <input
                    type="email"
                    required
                    className="w-full bg-transparent text-xs font-medium text-white placeholder:text-slate-300 focus:outline-none"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full sm:w-auto bg-[#5A3418] hover:bg-[#432611] text-white font-extrabold text-xs px-7 py-3 rounded-xl sm:rounded-full shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>{t('subscribe')}</span>
                  <Send size={14} />
                </motion.button>
              </form>
            )}

            {/* Privacy Note */}
            <p className="text-[10px] text-slate-300">
              🔒 We respect your privacy. No spam. Unsubscribe anytime with 1-click.
            </p>

          </div>
        </div>
      </LayoutContainer>
    </section>
  );
});
