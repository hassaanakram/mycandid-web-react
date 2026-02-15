import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import * as React from "react";
import { useState, useEffect, forwardRef, createElement } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "motion/react";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
var Slot = React.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (React.Children.count(newElement) > 1) return React.Children.only(null);
        return React.isValidElement(newElement) ? newElement.props.children : null;
      } else {
        return child;
      }
    });
    return /* @__PURE__ */ jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: React.isValidElement(newElement) ? React.cloneElement(newElement, void 0, newChildren) : null });
  }
  return /* @__PURE__ */ jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
});
Slot.displayName = "Slot";
var SlotClone = React.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if (React.isValidElement(children)) {
    const childrenRef = getElementRef(children);
    const props2 = mergeProps(slotProps, children.props);
    if (children.type !== React.Fragment) {
      props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
    }
    return React.cloneElement(children, props2);
  }
  return React.Children.count(children) > 1 ? React.Children.only(null) : null;
});
SlotClone.displayName = "SlotClone";
var Slottable = ({ children }) => {
  return /* @__PURE__ */ jsx(Fragment, { children });
};
function isSlottable(child) {
  return React.isValidElement(child) && child.type === Slottable;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a, _b;
  let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
const ERROR_IMG_SRC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";
function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);
  const handleError = () => {
    setDidError(true);
  };
  const { src, alt, style, className, ...rest } = props;
  return didError ? /* @__PURE__ */ jsx(
    "div",
    {
      className: `inline-block bg-gray-100 text-center align-middle ${className ?? ""}`,
      style,
      children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full h-full", children: /* @__PURE__ */ jsx("img", { src: ERROR_IMG_SRC, alt: "Error loading image", ...rest, "data-original-url": src }) })
    }
  ) : /* @__PURE__ */ jsx("img", { src, alt, className, style, ...rest, onError: handleError });
}
function TextCarousel({ texts, interval = 2500 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);
  return /* @__PURE__ */ jsx("div", { className: "relative h-20 overflow-hidden flex items-center justify-center", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 },
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      },
      className: "absolute",
      children: /* @__PURE__ */ jsx("span", { className: "text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent", children: texts[currentIndex] })
    },
    currentIndex
  ) }) });
}
function SEOHead({
  title = "MyCandid - Authentic Social Media Platform | Real Moments, Real Connections",
  description = "Join MyCandid, the social media platform where authenticity is everything. Share only what you capture in the moment. No filters, no fake content - just real human connections.",
  keywords = "authentic social media, real moments, genuine connections, unfiltered content, capture only app, authentic social network, candid moments, real social media, social media for real people",
  ogImage = "https://images.unsplash.com/photo-1765294661150-130e24807964?w=1200&h=630&fit=crop",
  url = "https://mycandid.com"
}) {
  useEffect(() => {
    document.title = title;
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);
    updateMetaTag("robots", "index, follow");
    updateMetaTag("author", "MyCandid");
    updateMetaTag("viewport", "width=device-width, initial-scale=1.0");
  }, [title, description, keywords, ogImage, url]);
  return null;
}
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$4);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$3);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$2);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
];
const Users = createLucideIcon("users", __iconNode);
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_5E8DfTdsCx1jXme7UeNh72qME4Js5EKUgvhIQ4_5xi8FyBtbsVuO6T1vugseip0edQ/exec";
async function submitToWaitlist(email, source = "website") {
  if (!isValidEmail$1(email)) {
    return {
      success: false,
      message: "Please enter a valid email address",
      error: "INVALID_EMAIL"
    };
  }
  const submissionData = {
    email: email.trim().toLowerCase(),
    source,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      // Google Apps Script requires no-cors mode
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(submissionData)
    });
    console.log("Waitlist submission response:", response);
    return {
      success: true,
      message: "Successfully added to waitlist!"
    };
  } catch (error) {
    console.error("Error submitting to waitlist:", error);
    return {
      success: false,
      message: "Unable to submit. Please try again later.",
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR"
    };
  }
}
function isValidEmail$1(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return regex.test(email.trim());
}
function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      if (isValidEmail(email)) {
        setIsLoading(true);
        const result = await submitToWaitlist(email, "hero-form");
        setIsLoading(false);
        if (result.success) {
          setSubmitted(true);
        } else {
          console.error(result.message);
        }
      }
    }
  };
  const carouselTexts = ["Real moments", "Real people", "Real connections"];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MyCandid",
    applicationCategory: "SocialNetworkingApplication",
    description: "Authentic social media platform where you share only what you capture in the moment. Real moments, real connections.",
    operatingSystem: "iOS, Android"
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SEOHead, {}),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(structuredData) }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900", children: [
      /* @__PURE__ */ jsxs("header", { className: "sr-only", children: [
        /* @__PURE__ */ jsx("h1", { children: "MyCandid - Authentic Social Media Platform" }),
        /* @__PURE__ */ jsx("p", { children: "Join the waitlist for the most authentic social media experience" })
      ] }),
      /* @__PURE__ */ jsxs("main", { children: [
        /* @__PURE__ */ jsx(
          "section",
          {
            className: "relative min-h-screen flex items-center justify-center px-4 py-20",
            "aria-labelledby": "hero-heading",
            children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl w-full", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsx(
                  "h1",
                  {
                    id: "hero-heading",
                    className: "text-5xl md:text-6xl font-bold text-white leading-tight",
                    children: "MyCandid: Authentic Social Media Platform"
                  }
                ),
                /* @__PURE__ */ jsx("div", { "aria-live": "polite", "aria-atomic": "true", children: /* @__PURE__ */ jsx(TextCarousel, { texts: carouselTexts }) }),
                /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-gray-300 max-w-2xl mx-auto", children: "The social media platform where authenticity isn't optional; it's everything. Share only what you capture in the moment with no fake content, and no curated feeds." })
              ] }),
              !submitted ? /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: handleSubmit,
                  className: "space-y-4 max-w-md mx-auto",
                  "aria-label": "Join waitlist form",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          type: "email",
                          placeholder: "Enter your email",
                          value: email,
                          onChange: (e) => setEmail(e.target.value),
                          required: true,
                          disabled: isLoading,
                          "aria-label": "Email address",
                          className: "flex-1 h-12 text-base bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "submit",
                          size: "lg",
                          disabled: isLoading,
                          className: "h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed",
                          children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                            "Joining..."
                          ] }) : "Join Waitlist"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Be among the first to reclaim social media and experience authentic connections." })
                  ]
                }
              ) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "p-6 bg-green-500/10 border border-green-500/30 rounded-lg max-w-md mx-auto",
                  role: "status",
                  "aria-live": "polite",
                  children: /* @__PURE__ */ jsx("p", { className: "text-green-400 font-medium", children: "🎉 Thanks for joining! We'll be in touch soon." })
                }
              )
            ] }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "section",
          {
            className: "py-20 px-4 bg-gray-800/50",
            "aria-labelledby": "about-heading",
            children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
              /* @__PURE__ */ jsxs("header", { className: "text-center mb-16", children: [
                /* @__PURE__ */ jsx(
                  "h2",
                  {
                    id: "about-heading",
                    className: "text-4xl font-bold text-white mb-4",
                    children: "Why MyCandid is Different from Other Social Media Platforms"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto", children: "We're building a platform that puts humans first." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20", children: [
                /* @__PURE__ */ jsxs("article", { className: "text-center space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsx(Camera, { className: "w-8 h-8 text-blue-400" })
                    }
                  ),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white", children: "Capture-Only Social Media" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Share only what you capture directly in the app. No uploads from gallery, no pre-edited content. Just authentic, in-the-moment photos and videos." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "text-center space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsx(Heart, { className: "w-8 h-8 text-purple-400" })
                    }
                  ),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white", children: "100% Authentic Content" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "No manipulated photos. Just real, unfiltered moments from your life that create genuine connections." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "text-center space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsx(Users, { className: "w-8 h-8 text-green-400" })
                    }
                  ),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white", children: "Real Human Connections" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Connect with friends and family through genuine, spontaneous moments. Build meaningful relationships through authentic sharing." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "text-center space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8 text-orange-400" })
                    }
                  ),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white", children: "Privacy-First Social Network" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Your moments are yours. Control who sees your content, when they see it, and how long it stays visible." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center", children: [
                /* @__PURE__ */ jsxs("article", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-white", children: "Take Back Control of Your Social Media Life" }),
                  /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-300", children: "Tired of the endless scroll through generated, fake content? MyCandid is different. We believe social media should bring us closer together, not make us feel more distant or inadequate." }),
                  /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-300", children: "By limiting what you can share to only what you capture in the moment, we're creating a space where authenticity thrives and genuine human connections flourish. No more pressure to maintain a perfect online persona." })
                ] }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "grid grid-cols-2 gap-4",
                    role: "img",
                    "aria-label": "Examples of authentic moments shared on MyCandid",
                    children: [
                      /* @__PURE__ */ jsx(
                        ImageWithFallback,
                        {
                          src: "https://images.unsplash.com/photo-1587272252152-1cf7beb0da6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwbW9tZW50cyUyMHNtYXJ0cGhvbmUlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NzA1MDEyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                          alt: "Person capturing authentic real-time moments with smartphone camera on MyCandid social media app",
                          className: "rounded-lg h-64 object-cover"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        ImageWithFallback,
                        {
                          src: "https://images.unsplash.com/photo-1757700314590-0ea0f33541f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW51aW5lJTIwaHVtYW4lMjBjb25uZWN0aW9ufGVufDF8fHx8MTc3MDUwMTI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                          alt: "Friends making genuine human connections and sharing authentic moments together",
                          className: "rounded-lg h-64 object-cover mt-8"
                        }
                      )
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "section",
          {
            className: "py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600",
            "aria-labelledby": "cta-heading",
            children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center space-y-8", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: "cta-heading",
                  className: "text-4xl md:text-5xl font-bold text-white",
                  children: "Ready to Experience Real Social Media?"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xl text-blue-100", children: "Join thousands on the waitlist for early access to MyCandid. Be part of the movement to reclaim authentic social connections." }),
              !submitted ? /* @__PURE__ */ jsx(
                "form",
                {
                  onSubmit: handleSubmit,
                  className: "max-w-md mx-auto",
                  "aria-label": "Join waitlist form",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "email",
                        placeholder: "Enter your email",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        required: true,
                        disabled: isLoading,
                        "aria-label": "Email address",
                        className: "flex-1 h-12 text-base bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        type: "submit",
                        size: "lg",
                        disabled: isLoading,
                        className: "h-12 px-8 bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                        children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                          "Joining..."
                        ] }) : "Join Waitlist"
                      }
                    )
                  ] })
                }
              ) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "p-6 bg-white/20 border border-white/30 rounded-lg max-w-md mx-auto",
                  role: "status",
                  "aria-live": "polite",
                  children: /* @__PURE__ */ jsx("p", { className: "text-white font-medium", children: "🎉 You're on the list! Check your email soon." })
                }
              )
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("footer", { className: "py-12 px-4 bg-gray-950 text-gray-400", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-white mb-2", children: "MyCandid" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mb-4", children: "The Authentic Social Media Platform for Real Connections" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-gray-800", children: /* @__PURE__ */ jsx("p", { className: "text-xs", children: "© 2026 MyCandid. All rights reserved. Real moments, real connections, authentic social media." }) })
      ] }) }) })
    ] })
  ] });
}
function render() {
  const html = renderToString(/* @__PURE__ */ jsx(App, {}));
  return html;
}
export {
  render
};
