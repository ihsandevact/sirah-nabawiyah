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

import { glossaryData } from '@/data/glossary';

interface RichTextParserProps {
  text: string;
  language: "id" | "en" | "ar";
}

export default function RichTextParser({ text, language }: RichTextParserProps) {
  // Combine characters and glossary
  const allNames = characters.flatMap(char => 
    char.names.map(name => ({ name, type: 'character', data: char }))
  );
  
  const allGlossary = glossaryData.flatMap(item => 
    item.terms.map(term => ({ name: term, type: 'glossary', data: item.definition }))
  );

  const allMatches = [...allNames, ...allGlossary].sort((a, b) => b.name.length - a.name.length);

  // Build a regex pattern using lookarounds for word boundaries (handles punctuation and Arabic better)
  const escapedNames = allMatches.map(n => n.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(?<=^|\\s|[.,!?;:'"()\\-])(${escapedNames.join('|')})(?=$|\\s|[.,!?;:'"()\\-])`, 'gi');

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
    const foundInfo = allMatches.find(n => n.name.toLowerCase() === matchedStr.toLowerCase());

    if (foundInfo) {
      if (foundInfo.type === 'character') {
        parts.push(
          <CharacterTooltip 
            key={`${match.index}-${matchedStr}`} 
            matchedText={matchedStr} 
            character={foundInfo.data as CharacterBio}
            language={language}
          />
        );
      } else {
        parts.push(
          <GlossaryTooltip 
            key={`${match.index}-${matchedStr}`} 
            matchedText={matchedStr} 
            definition={foundInfo.data as any}
            language={language}
          />
        );
      }
    } else {
      parts.push(matchedStr);
    }

    lastIndex = match.index + matchedStr.length;
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

function GlossaryTooltip({ matchedText, definition, language }: { matchedText: string, definition: {id:string,en:string,ar:string}, language: "id"|"en"|"ar" }) {
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

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <>
      <span 
        ref={refs.setReference} 
        {...getReferenceProps()} 
        className="text-desert-umber font-semibold border-b border-dashed border-desert-umber cursor-help hover:text-white transition-colors capitalize"
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
                className={`w-64 sm:w-72 bg-deep-obsidian border border-desert-umber/50 rounded-xl shadow-2xl p-4 pointer-events-none ${isArabic ? 'text-right' : 'text-left'}`}
              >
                <div className="font-bold text-desert-umber text-lg mb-2 capitalize">{matchedText}</div>
                <p className={`text-sm text-gray-300 leading-relaxed ${isArabic ? 'font-arabic text-base' : 'font-sans'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                  {definition[language]}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}
