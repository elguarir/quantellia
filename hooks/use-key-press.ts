import { useEffect, useRef, MutableRefObject } from "react";
import invariant from "tiny-invariant";

type KeypressHandler = (event: KeyboardEvent) => void;

/**
 * Custom hook that allows handling key presses.
 *
 * @param keys - The key(s) to listen for. Can be a single key as a string or an array of keys.
 * @param handler - The function to be called when the key(s) are pressed.
 */
const useKeypress = (
   keys: string | string[],
   handler?: KeypressHandler,
): void => {
   invariant(
      Array.isArray(keys) || typeof keys === "string",
      "Expected `keys` to be an array or string",
   );
   if (Array.isArray(keys)) {
      keys.forEach((key, i) => {
         invariant(
            typeof key === "string",
            `Expected \`keys[${i}]\` to be a string`,
         );
      });
   }
   invariant(
      typeof handler === "function" || handler == null,
      "Expected `handler` to be a function",
   );

   const eventListenerRef: MutableRefObject<KeypressHandler | undefined> =
      useRef();

   useEffect(() => {
      eventListenerRef.current = (event: KeyboardEvent) => {
         shimKeyboardEvent(event);
         if (
            Array.isArray(keys) ? keys.includes(event.key) : keys === event.key
         ) {
            handler?.(event);
         }
      };
   }, [keys, handler]);

   useEffect(() => {
      const eventListener = (event: KeyboardEvent) => {
         if (eventListenerRef.current) {
            eventListenerRef.current(event);
         }
      };
      window.addEventListener("keydown", eventListener);
      return () => {
         window.removeEventListener("keydown", eventListener);
      };
   }, []);
};

export default useKeypress;

// Fixing inconsistencies from older browsers
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
const aliases = new Map([
   ["Win", "Meta"],
   ["Scroll", "ScrollLock"],
   ["Spacebar", " "],
   ["Down", "ArrowDown"],
   ["Left", "ArrowLeft"],
   ["Right", "ArrowRight"],
   ["Up", "ArrowUp"],
   ["Del", "Delete"],
   ["Crsel", "CrSel"],
   ["Exsel", "ExSel"],
   ["Apps", "ContextMenu"],
   ["Esc", "Escape"],
   ["Decimal", "."],
   ["Multiply", "*"],
   ["Add", "+"],
   ["Subtract", "-"],
   ["Divide", "/"],
]);

const shimKeyboardEvent = (event: KeyboardEvent) => {
   if (aliases.has(event.key)) {
      const key = aliases.get(event.key);
      Object.defineProperty(event, "key", {
         configurable: true,
         enumerable: true,
         get() {
            return key;
         },
      });
   }
};
