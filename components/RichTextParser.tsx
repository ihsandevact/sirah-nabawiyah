import React, { useState } from 'react';
import { 
  useFloating, 
  autoUpdate, 
  offset, 
  flip, 
  shift, 
  useHover, 
  useFocus, 
  useDismiss, 
  useRole, 
  useInteractions, 
  FloatingPortal 
} from '@floating-ui/react';
import charactersData from '@/data/characters.json';
import { CharacterBio } from '@/types/character';
import { motion, AnimatePresence } from 'framer-motion';

const characters = charactersData as CharacterBio[];

interface RichTextParserProps {
  text: string;
  language: "id" | "en" | "ar";
}

export default function RichTextParser({ text, language }: RichTextParserProps) {
  // Sort characters by name length descending to match longer names first
  const allNames = characters.flatMap(char => 
    char.names.map(name => ({ name, char }))
  ).sort((a, b) => b.name.length - a.name.length);

  // Build a regex pattern
  const escapedNames = allNames.map(n => n.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escapedNames.join('|')})\\b`, 'gi');

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Find the character data for this match
    const matchedStr = match[0];
    const foundCharInfo = allNames.find(n => n.name.toLowerCase() === matchedStr.toLowerCase());

    if (foundCharInfo) {
      parts.push(
        <CharacterTooltip 
          key={`${match.index}-${matchedStr}`} 
          matchedText={matchedStr} 
          character={foundCharInfo.char}
          language={language}
        />
      );
    } else {
      parts.push(matchedStr);
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
}

function CharacterTooltip({ matchedText, character, language }: { matchedText: string, character: CharacterBio, language: "id"|"en"|"ar" }) {
  const [isOpen, setIsOpen] = useState(false);
  const isArabic = language === "ar";

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset(8), flip(), shift({ padding: 16 })],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ]);

  return (
    <>
      <span 
        ref={refs.setReference} 
        {...getReferenceProps()} 
        className="text-sand-gold font-semibold border-b border-dashed border-sand-gold cursor-help hover:text-white transition-colors"
      >
        {matchedText}
      </span>
      
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 9999 }}
              {...getFloatingProps()}
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`w-64 sm:w-72 bg-deep-obsidian border border-sand-gold/50 rounded-xl shadow-2xl p-4 pointer-events-none ${isArabic ? 'text-right' : 'text-left'}`}
              >
                <div className="font-bold text-sand-gold text-lg mb-1">{character.names[0]}</div>
                <div className="text-xs text-white/50 bg-white/5 inline-block px-2 py-1 rounded-md mb-3 font-sans tracking-wide">
                  {character.status}
                </div>
                <p className={`text-sm text-gray-300 leading-relaxed ${isArabic ? 'font-arabic text-base' : 'font-sans'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                  {character.bio[language]}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}
