import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import JSZip from "jszip";
import gsap from "gsap";
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Check,
  X,
  Sparkles,
  Download,
  Maximize2,
  Laptop,
  Smartphone,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  RefreshCw,
  Edit,
  Plus,
  Menu,
  Copy,
  RotateCcw,
  Home,
  History,
  Compass,
  HelpCircle,
  Settings,
  MessageSquare
} from "lucide-react";
import "./ScaleraAIBuilder.css";
import { FormattedMessage } from "../../utils/messageFormatter";

const ScaleraAIBuilder = ({ onBack }) => {
  // Authentication & Personalization States
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("scalera_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(!user);

  // Get time-based greeting for welcome screen
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Google Identity Services (GIS) script loading & initialization
  useEffect(() => {
    const scriptId = "google-gsi-client";
    const initGsi = () => {
      if (!window.google) return;
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "1000000000000-mockid.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        
        // Render Google button if wrapper exists
        const btnDiv = document.getElementById("google-signin-btn");
        if (btnDiv) {
          window.google.accounts.id.renderButton(btnDiv, {
            theme: "filled_blue",
            size: "large",
            shape: "pill",
            width: 280,
            logo_alignment: "left"
          });
        }
      } catch (err) {
        console.warn("Google Sign-in init failed:", err);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, [showLoginModal]);

  const handleCredentialResponse = (response) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      const userData = {
        name: decoded.name,
        given_name: decoded.given_name || decoded.name.split(' ')[0],
        picture: decoded.picture,
        email: decoded.email,
        id: decoded.sub
      };
      localStorage.setItem("scalera_user", JSON.stringify(userData));
      setUser(userData);
      setShowLoginModal(false);
    } catch (err) {
      console.error("Failed to parse Google login response", err);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: "Scalera Developer",
      given_name: "Developer",
      picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      email: "developer@scalera.ai",
      id: "demo-user-123"
    };
    localStorage.setItem("scalera_user", JSON.stringify(demoUser));
    setUser(demoUser);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("scalera_user");
    setUser(null);
    setShowLoginModal(true);
  };

  // Refs
  const containerRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const iframeRef = useRef(null);
  const resumeUploadRef = useRef(null);
  const textareaRef = useRef(null);
  const isSubmittingRef = useRef(false);

  // States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState([
    { id: "1", title: "New Digital Presence", date: "Today" }
  ]);
  const [activeConversationId, setActiveConversationId] = useState("1");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am Scalera AI. I'll help you build a premium digital presence in minutes. First, what is the name of your business or project?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [builderState, setBuilderState] = useState("chat"); // 'chat' | 'generating' | 'result'
  const [generationStatus, setGenerationStatus] = useState(
    "Analyzing brand requirements",
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [typing, setTyping] = useState(false);

  // Extracted / Unified data state
  const [extractedData, setExtractedData] = useState(null);

  // Auto-resize input textarea to fit text length dynamically
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  // Generated Code States
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [generatedCSS, setGeneratedCSS] = useState("");
  const [generatedJS, setGeneratedJS] = useState("");
  const [previewMode, setPreviewMode] = useState("desktop");

  // Modals
  const [activeModal, setActiveModal] = useState("none"); // 'none' | 'ready' | 'business-review' | 'resume-review' | 'image-manager'
  const [reviewBizData, setReviewBizData] = useState({
    business_name: "",
    business_type: "",
    description: "",
    address: "",
    rating: "",
    highlight_review: "",
  });
  const [reviewResumeData, setReviewResumeData] = useState({
    full_name: "",
    professional_title: "",
    bio: "",
    skills: "",
    experience: "",
  });
  const [scannedImages, setScannedImages] = useState([]);

  // AI Side Editors
  const [editorPanelOpen, setEditorPanelOpen] = useState(false);
  const [editorChat, setEditorChat] = useState([
    {
      role: "assistant",
      content: "What would you like to change on this website?",
    },
  ]);
  const [editorInput, setEditorInput] = useState("");
  const [editorLoading, setEditorLoading] = useState(false);
  const [pendingEdit, setPendingEdit] = useState(null);
  const [stableState, setStableState] = useState(null);
  const [showEditorConfirm, setShowEditorConfirm] = useState(false);

  // Section Editor Sidebar
  const [sectionEditorOpen, setSectionEditorOpen] = useState(false);
  const [currentEditingSection, setCurrentEditingSection] = useState(null);
  const [originalSectionHTML, setOriginalSectionHTML] = useState("");
  const [sectionEditPrompt, setSectionEditPrompt] = useState("");
  const [sectionEditLoading, setSectionEditLoading] = useState(false);
  const [showSectionConfirm, setShowSectionConfirm] = useState(false);

  // Speech / Voice Logic
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("Listening...");
  const [shouldSpeakNextResponse, setShouldSpeakNextResponse] = useState(false);
  const recognitionRef = useRef(null);
  const isVoiceEnabledRef = useRef(false);

  // ─────────────────────────────────────────────────
  // Initial Animations
  // ─────────────────────────────────────────────────
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".thin-sidebar",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8 },
      ).fromTo(
        ".chat-main-area",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // ─────────────────────────────────────────────────
  // Speech Recognition & Synthesis Initializer
  // ─────────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsVoiceActive(true);
        setShouldSpeakNextResponse(true);
        setVoiceTranscript("Listening to your vision...");
      };

      rec.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript;
            if (editorPanelOpen) {
              setEditorInput(finalTranscript);
            } else {
              setInputText(finalTranscript);
            }
            setVoiceTranscript(`"${finalTranscript}"`);
          } else {
            interimTranscript += event.results[i][0].transcript;
            setVoiceTranscript(`"${interimTranscript}..."`);
          }
        }
      };

      rec.onend = () => {
        setTimeout(() => {
          if (editorPanelOpen) {
            setEditorInput((prev) => {
              if (prev.trim()) {
                handleAIEditSubmit(prev);
              }
              return "";
            });
          } else {
            setInputText((prev) => {
              if (prev.trim()) {
                submitChat(prev, true);
              }
              return "";
            });
          }
        }, 500);

        if (isVoiceEnabledRef.current) {
          setTimeout(() => {
            try {
              if (isVoiceEnabledRef.current) {
                rec.start();
              }
            } catch (e) {
              console.log("Speech recognition restart ignored:", e);
            }
          }, 800);
        } else {
          setIsVoiceActive(false);
        }
      };

      rec.onerror = (err) => {
        console.error("Speech Recognition Error:", err);
        if (err.error === "aborted") return;
        setIsVoiceActive(false);
        isVoiceEnabledRef.current = false;
      };

      recognitionRef.current = rec;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorPanelOpen]);

  // Handle Auto-Scroll chat log
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // ─────────────────────────────────────────────────
  // Unified PostMessage Listener for Iframe Section Clicks
  // ─────────────────────────────────────────────────
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data && event.data.type === "OPEN_AI_EDITOR") {
        console.log(
          "[React Dashboard] Received OPEN_AI_EDITOR for section:",
          event.data.sectionId,
        );
        setCurrentEditingSection(event.data);
        setOriginalSectionHTML(event.data.content);
        setSectionEditorOpen(true);
        setSectionEditPrompt("");
        setShowSectionConfirm(false);
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  // ─────────────────────────────────────────────────
  // Speech helpers
  // ─────────────────────────────────────────────────
  const startListening = () => {
    if (recognitionRef.current) {
      window.speechSynthesis.cancel();
      isVoiceEnabledRef.current = true;
      setIsVoiceActive(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      isVoiceEnabledRef.current = false;
      setIsVoiceActive(false);
      recognitionRef.current.stop();
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      // Clean markdown bold tags and linebreaks for speech
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\n/g, " ");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      window.speechSynthesis.speak(utterance);
    }
  };

  // ─────────────────────────────────────────────────
  // Main Chat API Flows
  // ─────────────────────────────────────────────────
  const submitChat = async (text, wasVoice = false) => {
    if (!text.trim() || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    // Clear input and voice synth
    setInputText("");
    window.speechSynthesis.cancel();

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setTyping(true);

    try {
      // Check vision description trigger
      const visionKeywords = [
        "build",
        "create",
        "website",
        "portfolio",
        "site",
        "landing page",
        "for my",
        "want a",
      ];
      const isVisionDescription = visionKeywords.some((k) =>
        text.toLowerCase().includes(k),
      );

      let currentBlueprint = null;
      if (isVisionDescription && updatedMessages.length < 6) {
        // Pre-interpret visual architecture
        const interpretRes = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: text }),
        });
        const interpretData = await interpretRes.json();
        if (interpretData.status === "success") {
          currentBlueprint = interpretData.data;
        }
      }

      // Normal conversational response
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const chatData = await chatRes.json();
      setTyping(false);

      if (chatData.status === "success" && chatData.reply) {
        const aiReply =
          typeof chatData.reply === "string"
            ? chatData.reply
            : chatData.reply.reply;
        const isReady =
          typeof chatData.reply === "object" &&
          chatData.reply.ready_to_generate;

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiReply },
        ]);

        if (wasVoice || shouldSpeakNextResponse) {
          speakText(aiReply);
          setShouldSpeakNextResponse(false);
        }

        // If interpreter loaded a card, inject it!
        if (currentBlueprint) {
          injectVisionBlueprintCard(currentBlueprint, updatedMessages);
        }

        if (isReady) {
          const finalData = extractedData || {
            business_name: "My Business",
            site_type: "agency",
            tone: "premium",
            sections: ["Hero", "About", "Services", "Contact"]
          };
          const chatHistoryStr = updatedMessages
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n\n");
          // Auto generate instantly
          triggerGenerationProcess(chatHistoryStr, finalData);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble connecting to my servers right now.",
          },
        ]);
      }
      isSubmittingRef.current = false;
    } catch (err) {
      console.error("Chat Error:", err);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Error connecting to Scalera AI engine. Is the backend running?",
        },
      ]);
      isSubmittingRef.current = false;
    }
  };

  // Inject Blueprint visual card in chat flow
  const injectVisionBlueprintCard = (blueprint, historyBeforeCard) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "blueprint_card",
        blueprint: blueprint,
        chatHistory: historyBeforeCard,
      },
    ]);
  };

  // ─────────────────────────────────────────────────
  // Import Resume File Upload Flow
  // ─────────────────────────────────────────────────
  const handleResumeUploadClick = () => {
    if (resumeUploadRef.current) resumeUploadRef.current.click();
  };

  const handleResumeUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Uploaded resume: ${file.name}` },
    ]);
    setTyping(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setTyping(false);

      if (data.status === "success" && data.data) {
        if (data.data.error) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `**Analysis Issue:** ${data.data.error}. Please enter your details manually.`,
            },
          ]);
          return;
        }
        const parsed = data.data;
        setReviewResumeData({
          full_name: parsed.full_name || "",
          professional_title: parsed.professional_title || "",
          bio: parsed.bio || "",
          skills: Array.isArray(parsed.skills)
            ? parsed.skills.join(", ")
            : parsed.skills || "",
          experience: Array.isArray(parsed.experience)
            ? parsed.experience
                .map(
                  (exp) =>
                    `${exp.role} at ${exp.company} (${exp.duration || ""}) - ${exp.description || ""}`,
                )
                .join("\n\n")
            : parsed.experience || "",
        });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Analysis complete! I've structured your profile data. Please review it below to ensure accuracy.",
          },
        ]);
        setActiveModal("resume-review");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I couldn't read the resume file. Please verify it's a PDF or Docx.",
          },
        ]);
      }
    } catch (err) {
      console.error("Resume Extraction Error:", err);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error uploading resume." },
      ]);
    }
  };

  // Confirm Resume Upload review
  const confirmResumeReview = () => {
    const skillsArray = reviewResumeData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    const compiledData = {
      full_name: reviewResumeData.full_name,
      professional_title: reviewResumeData.professional_title,
      bio: reviewResumeData.bio,
      skills: skillsArray,
      experience: reviewResumeData.experience,
      source: "resume_upload",
    };

    setExtractedData(compiledData);
    setActiveModal("none");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Excellent! Your profile for **${compiledData.full_name}** is loaded. Click "Generate Website" to build your custom portfolio portfolio! 🚀`,
      },
    ]);
  };

  // ─────────────────────────────────────────────────
  // LinkedIn & Google Business Prompt Imports
  // ─────────────────────────────────────────────────
  const handleLinkedInImport = async () => {
    const url = prompt("Please enter your LinkedIn Profile URL:");
    if (!url) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Analyze LinkedIn: ${url}` },
    ]);
    setTyping(true);

    const formData = new FormData();
    formData.append("link", url);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setTyping(false);

      if (data.status === "success" && data.data) {
        const parsed = data.data;
        setReviewResumeData({
          full_name: parsed.full_name || "",
          professional_title: parsed.professional_title || "",
          bio: parsed.bio || "",
          skills: Array.isArray(parsed.skills)
            ? parsed.skills.join(", ")
            : parsed.skills || "",
          experience: Array.isArray(parsed.experience)
            ? parsed.experience
                .map(
                  (exp) =>
                    `${exp.role} at ${exp.company} (${exp.duration || ""}) - ${exp.description || ""}`,
                )
                .join("\n\n")
            : parsed.experience || "",
        });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "LinkedIn profile imported. Review your information below to edit any locked fields.",
          },
        ]);
        setActiveModal("resume-review");
      }
    } catch (err) {
      console.error("LinkedIn import error:", err);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to connect to LinkedIn import module.",
        },
      ]);
    }
  };

  const handleGoogleBusinessImport = async () => {
    const link = prompt("Please paste your Google Business / Maps link:");
    if (!link) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: "Fetching Google Maps listing details... 📍" },
    ]);
    setTyping(true);

    try {
      const res = await fetch("/api/import/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link }),
      });
      const data = await res.json();
      setTyping(false);

      if (data.status === "success" && !data.data.error) {
        const parsed = data.data;
        setReviewBizData({
          business_name: parsed.business_name || "",
          business_type: parsed.business_type || "",
          description: parsed.description || "",
          address: parsed.address || "",
          rating: parsed.rating || "",
          highlight_review: parsed.highlight_review || "",
        });
        setActiveModal("business-review");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I couldn't fetch details for that Maps listing. You can still type details manually!",
          },
        ]);
      }
    } catch (err) {
      console.error("Google maps import error:", err);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error loading Google maps details.",
        },
      ]);
    }
  };

  // Confirm Google Business review
  const confirmBusinessReview = () => {
    const compiledData = {
      ...reviewBizData,
      source: "google_business",
    };

    setExtractedData(compiledData);
    setActiveModal("none");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Great! I've loaded your business details for **${compiledData.business_name}**. Click "Generate Website" to build your site with this data! 🚀`,
      },
    ]);
  };

  // ─────────────────────────────────────────────────
  // Dynamic Vision Card Actions
  // ─────────────────────────────────────────────────
  const handleConfirmVisionCard = (blueprint, historyBlock) => {
    if (!blueprint.business_name.trim()) {
      alert("Please enter a Business Name to continue.");
      return;
    }

    const dataToSave = {
      ...blueprint,
      source: "vision_description",
    };

    setExtractedData(dataToSave);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Blueprint confirmed for **${dataToSave.business_name}**! Initializing the Scalera engine... 🚀`,
      },
    ]);

    // Auto start generation
    const chatHistoryStr = historyBlock
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");
    triggerGenerationProcess(chatHistoryStr, dataToSave);
  };

  // ─────────────────────────────────────────────────
  // Cinematic Generation Workflow
  // ─────────────────────────────────────────────────
  const handleGenerateClick = () => {
    if (!extractedData || !extractedData.business_name) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I don't have enough information about your site to generate. Please tell me about your business first!",
        },
      ]);
      return;
    }

    const chatHistoryStr = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");
    triggerGenerationProcess(chatHistoryStr, extractedData);
  };

  const triggerGenerationProcess = (chatHistoryStr, finalData) => {
    setBuilderState("generating");
    setCurrentStep(1);
    setGenerationStatus("Analyzing brand identity...");

    const steps = [
      { id: 1, text: "Analyzing brand identity..." },
      { id: 2, text: "Crafting layout & styles..." },
      { id: 3, text: "Generating source code..." },
      { id: 4, text: "Optimizing for launch..." },
    ];

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < steps.length) {
        setCurrentStep(index + 1);
        setGenerationStatus(steps[index].text);
      } else {
        clearInterval(interval);
        setGenerationStatus("Awaiting final response from Scalera AI...");
        executeBackendGenerate(chatHistoryStr, finalData);
      }
    }, 2200);
  };

  const executeBackendGenerate = async (chatHistoryStr, finalData) => {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_history: chatHistoryStr,
          data: finalData,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setGeneratedHTML(data.html || "");
        setGeneratedCSS(data.css || "");
        setGeneratedJS(data.js || "");

        const composite = buildCompositeHTML(
          data.html || "",
          data.css || "",
          data.js || "",
        );
        setBuilderState("result");

        // Mount blob URL
        setTimeout(() => {
          updateIframeBlob(composite);
        }, 100);
      } else {
        setBuilderState("chat");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "**Generation failed.** The AI engine returned an error, please try again.",
          },
        ]);
      }
    } catch (err) {
      console.error("Generate error:", err);
      setBuilderState("chat");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error running site generator.",
        },
      ]);
    }
  };

  // Helper: Composite inline code injection
  const buildCompositeHTML = (html, css, js) => {
    const cleanHtml = html.trim();
    if (
      cleanHtml.toLowerCase().startsWith("<!doctype") ||
      cleanHtml.startsWith("<html")
    ) {
      let composite = cleanHtml
        .replace(
          /<link[^>]+href=["']styles\.css["'][^>]*>/gi,
          `<style>\n${css}\n</style>`,
        )
        .replace(
          /<script[^>]+src=["']script\.js["'][^>]*><\/script>/gi,
          `<script>\n${js}\n</script>`,
        );
      return composite;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Scalera Generated Site</title>
<style>
${css}
</style>
</head>
<body>
${html}
<script>
${js}
</script>
</body>
</html>`;
  };

  const updateIframeBlob = (htmlContent) => {
    if (!iframeRef.current) return;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
  };

  // ─────────────────────────────────────────────────
  // AI General Sidebar Editor
  // ─────────────────────────────────────────────────
  const openAIEditor = () => {
    setStableState({
      html: generatedHTML,
      css: generatedCSS,
      js: generatedJS,
    });
    setEditorPanelOpen(true);
    setShowEditorConfirm(false);
  };

  const handleAIEditSubmit = async (promptText) => {
    if (!promptText.trim()) return;

    setEditorChat((prev) => [...prev, { role: "user", content: promptText }]);
    setEditorInput("");
    setEditorLoading(true);

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: generatedHTML,
          css: generatedCSS,
          prompt: promptText,
        }),
      });
      const data = await res.json();
      setEditorLoading(false);

      if (data.status === "success" && data.html) {
        setEditorChat((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I've made the changes! You can preview them now.",
          },
        ]);
        setPendingEdit({ html: data.html, css: data.css });
        setShowEditorConfirm(true);

        // Inject draft into preview
        const draftComposite = buildCompositeHTML(
          data.html,
          data.css,
          generatedJS,
        );
        updateIframeBlob(draftComposite);
      } else {
        setEditorChat((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I couldn't process that edit right now. Try a different request.",
          },
        ]);
      }
    } catch (err) {
      console.error("AI Edit error:", err);
      setEditorLoading(false);
      setEditorChat((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error editing page." },
      ]);
    }
  };

  const applyAIEdit = () => {
    if (!pendingEdit) return;
    setGeneratedHTML(pendingEdit.html);
    setGeneratedCSS(pendingEdit.css);

    setStableState(null);
    setPendingEdit(null);
    setShowEditorConfirm(false);
    setEditorChat((prev) => [
      ...prev,
      { role: "assistant", content: "Changes applied successfully!" },
    ]);
  };

  const discardAIEdit = () => {
    if (stableState) {
      setGeneratedHTML(stableState.html);
      setGeneratedCSS(stableState.css);
      setGeneratedJS(stableState.js);

      const finalComposite = buildCompositeHTML(
        stableState.html,
        stableState.css,
        stableState.js,
      );
      updateIframeBlob(finalComposite);
    }

    setPendingEdit(null);
    setShowEditorConfirm(false);
    setEditorChat((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Changes discarded. Reverted to previous version.",
      },
    ]);
  };

  // ─────────────────────────────────────────────────
  // In-Context Section Editor
  // ─────────────────────────────────────────────────
  const applySectionEdit = async () => {
    if (!sectionEditPrompt.trim()) return;

    setSectionEditLoading(true);
    try {
      const res = await fetch("/api/edit-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: currentEditingSection.content,
          prompt: sectionEditPrompt,
          type: currentEditingSection.sectionType,
        }),
      });
      const data = await res.json();
      setSectionEditLoading(false);

      if (data.status === "success") {
        // Post message back inside preview to swap content
        if (iframeRef.current) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: "UPDATE_SECTION_HTML",
              sectionId: currentEditingSection.sectionId,
              newHtml: data.data,
            },
            "*",
          );
        }
        setShowSectionConfirm(true);
      }
    } catch (err) {
      console.error("Section edit error:", err);
      setSectionEditLoading(false);
      alert("Failed to modify section, try again.");
    }
  };

  const keepSectionEdit = () => {
    // Read full serialized outerHTML from iframe to preserve state updates
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const doc = iframeRef.current.contentWindow.document;
        setGeneratedHTML(doc.documentElement.outerHTML);
      }
    } catch (e) {
      console.error("Error serializing DOM:", e);
    }
    setSectionEditorOpen(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Section updated! The changes have been applied to your live preview. 🪄`,
      },
    ]);
  };

  const discardSectionEdit = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "UPDATE_SECTION_HTML",
          sectionId: currentEditingSection.sectionId,
          newHtml: originalSectionHTML,
        },
        "*",
      );
    }
    setSectionEditorOpen(false);
  };

  // ─────────────────────────────────────────────────
  // Image Customizer Scanner & Replacer
  // ─────────────────────────────────────────────────
  const openImageManager = () => {
    if (!iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentWindow.document;
      const images = doc.querySelectorAll("img");
      const list = Array.from(images).map((img, idx) => {
        const parentId = img.closest("section, header, div[id]")?.id || "";
        let label =
          img.alt ||
          (parentId
            ? `${parentId.charAt(0).toUpperCase() + parentId.slice(1)} Image`
            : `Image #${idx + 1}`);
        return {
          index: idx,
          src: img.src,
          label: label,
          elementRef: img,
        };
      });
      setScannedImages(list);
      setActiveModal("image-manager");
    } catch (e) {
      console.error("Image scanning failed (CORS?):", e);
      alert(
        "Could not load preview context. Please ensure the website is fully generated.",
      );
    }
  };

  const handleImageReplacement = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;

      // 1. Update list thumbnails
      setScannedImages((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], src: dataUrl };
        return copy;
      });

      // 2. Update real element inside Iframe DOM
      try {
        const doc = iframeRef.current.contentWindow.document;
        const iframeImgs = doc.querySelectorAll("img");
        if (iframeImgs[index]) {
          iframeImgs[index].src = dataUrl;
          // Serialise new state
          const updatedComposite =
            "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
          setGeneratedHTML(updatedComposite);
        }
      } catch (err) {
        console.error("Error setting image inside DOM:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // ─────────────────────────────────────────────────
  // ZIP Package Downloader
  // ─────────────────────────────────────────────────
  const downloadZipPackage = async () => {
    if (!generatedHTML) {
      alert("No website generated yet.");
      return;
    }

    const zip = new JSZip();

    let inferredName = "website";
    const nameMatch = messages.find((m) => m.role === "user");
    if (nameMatch && nameMatch.content.length < 20)
      inferredName = nameMatch.content;
    const safeName = inferredName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    // Verify script & style imports exist in raw HTML block
    let htmlFile = generatedHTML;
    if (!htmlFile.includes("styles.css")) {
      htmlFile = htmlFile.replace(
        "</head>",
        '  <link rel="stylesheet" href="styles.css">\n</head>',
      );
    }
    if (!htmlFile.includes("script.js")) {
      htmlFile = htmlFile.replace(
        "</body>",
        '  <script src="script.js"></script>\n</body>',
      );
    }

    zip.file("index.html", htmlFile);
    zip.file("styles.css", generatedCSS || "/* Generated by Scalera */");
    zip.file("script.js", generatedJS || "// Generated by Scalera");
    zip.file(
      "README.md",
      `# ${inferredName}\nGenerated by Scalera AI.\n\nOpen index.html to view your site!`,
    );

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${safeName}-scalera-ai.zip`;
      link.click();
    } catch (e) {
      console.error("Zip error:", e);
      alert("Failed to build ZIP file.");
    }
  };

  // Fullscreen toggler
  const toggleFullscreen = () => {
    const container = document.getElementById("mockup-window-ref");
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const openInNewTab = () => {
    // Save current code to localStorage so preview.html handles it
    localStorage.setItem("scalera-preview-html", generatedHTML);
    localStorage.setItem("scalera-preview-css", generatedCSS);
    localStorage.setItem("scalera-preview-js", generatedJS);
    window.open("/preview.html", "_blank");
  };

  return (
    <div ref={containerRef} className="ai-builder-container">
      {/* Thin Left Sidebar (Mockup style) */}
      <div className="thin-sidebar">
        <div className="thin-sidebar-top">
          <div className="sidebar-logo-mark" onClick={onBack} title="Back to Homepage">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="logo-symbol">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <button 
            className="thin-sidebar-plus-btn"
            onClick={() => {
              if (window.confirm("Start a new chat session?")) {
                setMessages([{ role: "assistant", content: "Hello! Let's build something new. What is your project about?" }]);
                setInputText("");
                setExtractedData(null);
                setBuilderState("chat");
              }
            }}
            title="New Chat"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="thin-sidebar-nav">
          <button 
            className="thin-sidebar-nav-btn active"
            onClick={() => {
              setBuilderState("chat");
            }}
            title="Home"
          >
            <Home size={20} />
          </button>
          <button 
            className={`thin-sidebar-nav-btn ${!sidebarCollapsed ? "active-drawer" : ""}`}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="History"
          >
            <History size={20} />
          </button>
          <button 
            className="thin-sidebar-nav-btn"
            onClick={() => {
              setMessages(prev => [
                ...prev,
                { role: "assistant", content: "You can select one of our 21 premium templates including: Agency, SaaS, Corporate, Dental Clinic, Restaurant, and Portfolio." }
              ]);
            }}
            title="Discover Templates"
          >
            <Compass size={20} />
          </button>
        </div>

        <div className="thin-sidebar-bottom">
          <button 
            className="thin-sidebar-nav-btn"
            onClick={() => {
              setMessages(prev => [
                ...prev,
                { role: "assistant", content: "Scalera AI automates your web development. Ask a prompt, customize details, edit elements in-context, and download your full ZIP package instantly." }
              ]);
            }}
            title="Help"
          >
            <HelpCircle size={20} />
          </button>
          <button 
            className="thin-sidebar-nav-btn"
            onClick={() => {
              setActiveModal("business-review");
            }}
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <div 
            className="thin-sidebar-avatar-wrapper" 
            title={user ? `${user.name} (${user.email}) - Click to Log Out` : "Not Logged In"}
            onClick={user ? handleLogout : () => setShowLoginModal(true)}
            style={{ cursor: 'pointer' }}
          >
            <img
              className="thin-sidebar-avatar"
              src={user && user.picture ? user.picture : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"}
              alt="User"
            />
          </div>
        </div>
      </div>

      {/* Collapsible History Drawer */}
      <div className={`history-panel-drawer ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="drawer-header">
          <h4>Recent Chats</h4>
          <button className="close-drawer-btn" onClick={() => setSidebarCollapsed(true)}>
            <X size={16} />
          </button>
        </div>
        <div className="drawer-list">
          {conversations.map((conv) => (
            <div 
              key={conv.id} 
              className={`drawer-item ${activeConversationId === conv.id ? "active" : ""}`}
              onClick={() => {
                setActiveConversationId(conv.id);
                setSidebarCollapsed(true);
              }}
            >
              <MessageSquare size={14} style={{ marginRight: "8px", flexShrink: 0 }} />
              <span>{conv.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="builder-main-content">
        
        {/* Top Navbar */}
        <div className="builder-top-navbar" style={{
          display: "flex", justifyContent: "center", alignItems: "center", 
          padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(10, 10, 10, 0.5)", backdropFilter: "blur(10px)",
          zIndex: 100, position: "relative"
        }}>
          <div className="builder-logo-centered" style={{
            fontWeight: 700, fontSize: "1.35rem", letterSpacing: "-0.03em", color: "var(--text-primary)"
          }}>
            Scalera<span style={{ color: "var(--accent-color)" }}>.</span> AI
          </div>
        </div>

        {/* Ambient Background Glow */}
        <div className="glow-orb" style={{ top: "30%", left: "30%" }}></div>
        <div className="glow-orb" style={{ top: "80%", left: "70%" }}></div>

        {/* 1. Conversational Chat Screen */}
        {builderState === "chat" && (
          <div className="ai-chat-workspace">
            {/* Background Grid Pattern & Glass Bubble */}
            <div className="grid-overlay"></div>
            {messages.length === 1 && !typing && (
              <>
                <div className="floating-glass-orb"></div>
                <div className="glass-bubble"></div>
              </>
            )}

            {/* Main Chat Workspace */}
            <div className="chat-main-area">
              <div className="chat-header-row">
                <div className="model-selector-wrapper">
                  <div className="model-icon">✨</div>
                  <select
                    className="model-select-dropdown"
                    defaultValue="scalera-omni"
                  >
                    <option value="scalera-omni">
                      Scalera Omni v2.5 (High Performance)
                    </option>
                    <option value="scalera-flash">
                      Scalera Speed v2.5 (Fast)
                    </option>
                    <option value="scalera-creative">
                      Scalera Creative Pro (Detailed)
                    </option>
                  </select>
                </div>

                <div className="header-actions-group">
                  <div className="status-indicator">
                    <div className="status-dot pulsing"></div>
                    <span>Engine Active</span>
                  </div>

                  {extractedData?.suggested_template && (
                    <div className="niche-badge" title="Detected niche template">
                      <Sparkles size={12} /> {extractedData.suggested_template.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </div>
                  )}
                </div>
              </div>

              <div ref={chatHistoryRef} className="chat-history">
                <div className="chat-centered-container">
                {messages.map((msg, index) => {
                  if (msg.content === "blueprint_card") {
                    return (
                      <div key={index} className="chat-message ai-message">
                        <div className="message-avatar">S.</div>
                        <div
                          className="message-content"
                          style={{ width: "100%", maxWidth: "500px" }}
                        >
                          <div className="vision-card">
                            <h4
                              style={{
                                color: "var(--accent-color)",
                                marginBottom: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "1.05rem",
                              }}
                            >
                              <Zap size={18} /> Proposed Website Blueprint
                            </h4>

                            <div className="form-group">
                              <label
                                style={{ fontSize: "0.75rem", opacity: 0.6 }}
                              >
                                Business Name
                              </label>
                              <input
                                type="text"
                                defaultValue={msg.blueprint.business_name}
                                className="v-name premium-input"
                                onChange={(e) => {
                                  msg.blueprint.business_name = e.target.value;
                                }}
                              />
                            </div>

                            <div
                              className="form-row"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "10px",
                                marginBottom: "15px",
                              }}
                            >
                              <div className="form-group">
                                <label
                                  style={{ fontSize: "0.75rem", opacity: 0.6 }}
                                >
                                  Style
                                </label>
                                <input
                                  type="text"
                                  defaultValue={msg.blueprint.tone}
                                  className="v-tone premium-input"
                                  onChange={(e) => {
                                    msg.blueprint.tone = e.target.value;
                                  }}
                                />
                              </div>
                              <div className="form-group">
                                <label
                                  style={{ fontSize: "0.75rem", opacity: 0.6 }}
                                >
                                  Industry
                                </label>
                                <input
                                  type="text"
                                  defaultValue={msg.blueprint.site_type}
                                  className="v-type premium-input"
                                  onChange={(e) => {
                                    msg.blueprint.site_type = e.target.value;
                                  }}
                                />
                              </div>
                            </div>

                            <div
                              className="form-group"
                              style={{ marginBottom: "20px" }}
                            >
                              <label
                                style={{ fontSize: "0.75rem", opacity: 0.6 }}
                              >
                                Sections Architecture
                              </label>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "6px",
                                  marginTop: "8px",
                                }}
                              >
                                {(msg.blueprint.sections || []).map(
                                  (sec, sIdx) => (
                                    <div key={sIdx} className="section-chip">
                                      {sec}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                              <button
                                className="btn-primary"
                                style={{ flex: 1, padding: "12px" }}
                                onClick={() =>
                                  handleConfirmVisionCard(
                                    msg.blueprint,
                                    msg.chatHistory,
                                  )
                                }
                              >
                                Confirm & Build 🚀
                              </button>
                              <button
                                className="btn-secondary"
                                style={{ padding: "12px 18px" }}
                                onClick={() => {
                                  speakText(
                                    "What would you like to edit in your vision blueprint?",
                                  );
                                  setInputText("Change blueprint to: ");
                                }}
                              >
                                Edit Vision
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className={`chat-message ${msg.role === "user" ? "user-message" : "ai-message"}`}
                    >
                      <div className="message-avatar">
                        {msg.role === "user" ? "U" : "S."}
                      </div>
                      <div className="message-content">
                        {msg.role === "assistant" ? (
                          <FormattedMessage text={msg.content} />
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                      <div className="message-actions">
                        <button className="message-action-btn" title="Copy text">
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {messages.length === 1 && !typing && (
                  <div className="chat-welcome-container-premium">
                    {/* Centered Glowing Orb */}
                    <div className="welcome-avatar-orb">
                      <div className="welcome-orb-inner"></div>
                      <div className="welcome-orb-glow"></div>
                    </div>

                    <h1 className="chat-welcome-headline">
                      {getGreeting()}, {user ? user.given_name : "Guest"}
                    </h1>
                    <p className="chat-welcome-subtitle">
                      Enter a simple prompt to generate anything you want !
                    </p>

                    {/* Centered Prompt Input Card (Mockup Style) */}
                    <div className="center-prompt-card">
                      <div className="prompt-card-header">
                        <span className="prompt-header-title">✦ Ask whatever you want</span>
                        <div className="prompt-engine-selector">
                          <span>🌐 All Web</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "4px" }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                      <textarea
                        className="prompt-card-textarea"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submitChat(inputText);
                          }
                        }}
                        placeholder="Message Scalera AI..."
                        rows={3}
                      />
                      <div className="prompt-card-footer">
                        <div className="prompt-left-actions">
                          <button type="button" className="prompt-action-btn" onClick={handleResumeUploadClick}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: "rotate(45deg)", marginRight: "4px" }}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            Add Attachment
                          </button>
                          <button type="button" className="prompt-action-btn" onClick={openImageManager}>
                            <ImageIcon size={14} style={{ marginRight: "4px" }} />
                            Use Image
                          </button>
                          <button 
                            type="button" 
                            className={`prompt-action-btn ${isVoiceActive ? "listening" : ""}`}
                            onClick={isVoiceActive ? stopListening : startListening}
                            style={{ color: isVoiceActive ? "var(--accent-color)" : "", borderColor: isVoiceActive ? "var(--accent-color)" : "" }}
                          >
                            {isVoiceActive ? <MicOff size={14} style={{ marginRight: "4px" }} /> : <Mic size={14} style={{ marginRight: "4px" }} />}
                            {isVoiceActive ? "Stop Voice" : "Voice Input"}
                          </button>
                        </div>
                        <div className="prompt-right-actions">
                          <span className="char-counter">{inputText.length}/1000</span>
                          <button 
                            className="prompt-send-btn" 
                            onClick={() => submitChat(inputText)}
                            disabled={!inputText.trim() || typing}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
                </div> {/* End chat-centered-container */}

                {typing && (
                  <div className="thinking-indicator">
                    <div className="message-avatar" style={{ opacity: 0.5 }}>S.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '1rem' }}>
                      <span className="thinking-label">Thinking...</span>
                      <div className="thinking-shimmer"></div>
                    </div>
                  </div>
                )}
              </div>

              {messages.length > 1 && (
                <div className="chat-input-area-premium">
                  <form
                    className="ai-input-form-premium"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitChat(inputText);
                    }}
                  >
                    <div className="input-box-premium">
                      <div className="input-box-header">
                        <span className="sparkle-icon-wrapper">✦</span>
                      </div>
                      <textarea
                        ref={textareaRef}
                        id="ai-input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            e.currentTarget.form.requestSubmit();
                          }
                        }}
                        placeholder="Message Scalera AI..."
                        rows={1}
                        required
                      />
                      <div className="input-box-footer">
                        <div className="left-actions">
                          <button
                            type="button"
                            className="btn-attach-file"
                            onClick={handleResumeUploadClick}
                            title="Attach document"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              style={{ transform: "rotate(45deg)" }}
                            >
                              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                            </svg>
                            Attach
                          </button>

                          <button
                            type="button"
                            className={`btn-mic-premium ${isVoiceActive ? "listening" : ""}`}
                            onClick={
                              isVoiceActive ? stopListening : startListening
                            }
                            title={
                              isVoiceActive ? "Stop voice input" : "Voice input"
                            }
                          >
                            <Mic size={16} />
                          </button>
                        </div>

                        <button
                          type="submit"
                          className="btn-send-premium"
                          disabled={!inputText.trim() || typing}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="disclaimer-text">
                    Scalera AI can make mistakes. Check important info.
                  </div>

                  {isVoiceActive && (
                    <div className="voice-status-overlay">
                      <div className="voice-wave-container">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                      </div>
                      <p className="transcript-preview">{voiceTranscript}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Removed right sidebar for a clean ChatGPT style focus */}
          </div>
        )}

        {/* 2. Cinematic Generation Overlay */}
        {builderState === "generating" && (
          <div className="ai-generating-box">
            <div className="generation-visual">
              <div className="ai-orb-container">
                <div className="ai-orb"></div>
                <div className="ai-orb-ring"></div>
                <div className="ai-orb-ring ring-delayed"></div>
              </div>
              <h2
                className="text-gradient"
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 600,
                  marginTop: "1.5rem",
                }}
              >
                Architecting your website...
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginTop: "0.5rem",
                  fontSize: "1rem",
                }}
              >
                {generationStatus}
              </p>
            </div>

            <div className="process-tracker animating">
              <div
                className={`process-step ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}
              >
                <div className="step-indicator"></div>
                <div className="step-info">
                  <span className="step-label">Analysis</span>
                  <span className="step-desc">Brand Identity</span>
                </div>
              </div>
              <div
                className={`process-step ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}
              >
                <div className="step-indicator"></div>
                <div className="step-info">
                  <span className="step-label">Design</span>
                  <span className="step-desc">Styles & Layout</span>
                </div>
              </div>
              <div
                className={`process-step ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}`}
              >
                <div className="step-indicator"></div>
                <div className="step-info">
                  <span className="step-label">Engineering</span>
                  <span className="step-desc">HTML/CSS Code</span>
                </div>
              </div>
              <div
                className={`process-step ${currentStep === 4 ? "active" : currentStep > 4 ? "completed" : ""}`}
              >
                <div className="step-indicator"></div>
                <div className="step-info">
                  <span className="step-label">Finalizing</span>
                  <span className="step-desc">Launch Optimization</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Generated Workspace Dashboard */}
        {builderState === "result" && (
          <div className="ai-result-box full-screen-preview">
            <div className="result-header">
              <h2>Website Generated Successfully.</h2>
              <p>
                Customize, rewrite or finalize your digital presence instantly.
              </p>

              <div className="result-actions">
                <button
                  className="action-btn-pill btn-edit-ai"
                  onClick={openAIEditor}
                >
                  <Sparkles size={16} /> Edit with AI ✨
                </button>
                <button
                  className="action-btn-pill btn-secondary"
                  onClick={downloadZipPackage}
                >
                  <Download size={16} /> Download Source
                </button>
                <button
                  className="action-btn-pill btn-secondary"
                  onClick={openImageManager}
                >
                  <ImageIcon size={16} /> Customize Images
                </button>
                <button
                  className="action-btn-pill btn-secondary"
                  onClick={openInNewTab}
                >
                  <RefreshCw size={16} /> Open Preview
                </button>
                <button
                  className="action-btn-pill btn-secondary"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 size={16} /> Fullscreen
                </button>
                <button
                  className="action-btn-pill btn-secondary"
                  onClick={() => {
                    setBuilderState("chat");
                    setExtractedData(null);
                  }}
                >
                  Start Over
                </button>
              </div>
            </div>

            <div className="mockup-window-container">
              <div className="mockup-controls">
                <button
                  className="btn-secondary"
                  style={{
                    color:
                      previewMode === "desktop" ? "var(--accent-color)" : "",
                    borderColor:
                      previewMode === "desktop" ? "var(--accent-color)" : "",
                  }}
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Laptop size={14} style={{ marginRight: "6px" }} /> Desktop
                </button>
                <button
                  className="btn-secondary"
                  style={{
                    color:
                      previewMode === "mobile" ? "var(--accent-color)" : "",
                    borderColor:
                      previewMode === "mobile" ? "var(--accent-color)" : "",
                  }}
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone size={14} style={{ marginRight: "6px" }} /> Mobile
                </button>
              </div>

              <div
                id="mockup-window-ref"
                className="mockup-window"
                style={{
                  width: previewMode === "desktop" ? "100%" : "375px",
                  transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="mockup-url">
                    {extractedData?.business_name
                      ? `${extractedData.business_name.toLowerCase().replace(/[^a-z0-9]/g, "")}.scalera.ai`
                      : "yourbrand.scalera.ai"}
                  </div>
                </div>
                <div className="mockup-body">
                  <iframe
                    ref={iframeRef}
                    title="Scalera AI Live Preview"
                    className="preview-iframe"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────
                   MODALS LIST
                   ───────────────────────────────────────────────── */}

        {/* Ready Modal */}
        {activeModal === "ready" && (
          <div className="modal-overlay">
            <div className="minimalist-modal animate-modal">
              <div className="modal-ready-text">
                Your website blueprint is architected. Would you like to review
                and add details or generate now?
              </div>
              <div className="modal-actions-row">
                <button
                  className="btn-secondary"
                  style={{ padding: "10px 20px" }}
                  onClick={() => setActiveModal("none")}
                >
                  Review Details
                </button>
                <button
                  className="btn-generate-premium"
                  onClick={() => {
                    setActiveModal("none");
                    handleGenerateClick();
                  }}
                >
                  Generate Website ✨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resume Upload Review Modal */}
        {activeModal === "resume-review" && (
          <div className="modal-overlay">
            <div className="modal-content glass-card animate-modal">
              <div className="modal-header">
                <h3>Verify Profile Details</h3>
                <p>Verify information captured by the AI engine.</p>
              </div>
              <div
                className="modal-body"
                style={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  paddingRight: "6px",
                }}
              >
                <div
                  className="form-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={reviewResumeData.full_name}
                      onChange={(e) =>
                        setReviewResumeData({
                          ...reviewResumeData,
                          full_name: e.target.value,
                        })
                      }
                      className="premium-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Professional Title</label>
                    <input
                      type="text"
                      value={reviewResumeData.professional_title}
                      onChange={(e) =>
                        setReviewResumeData({
                          ...reviewResumeData,
                          professional_title: e.target.value,
                        })
                      }
                      className="premium-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Profile Biography</label>
                  <textarea
                    value={reviewResumeData.bio}
                    onChange={(e) =>
                      setReviewResumeData({
                        ...reviewResumeData,
                        bio: e.target.value,
                      })
                    }
                    className="premium-input"
                    style={{ height: "70px" }}
                  />
                </div>
                <div className="form-group">
                  <label>Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={reviewResumeData.skills}
                    onChange={(e) =>
                      setReviewResumeData({
                        ...reviewResumeData,
                        skills: e.target.value,
                      })
                    }
                    className="premium-input"
                  />
                </div>
                <div className="form-group">
                  <label>Experience & Milestones</label>
                  <textarea
                    value={reviewResumeData.experience}
                    onChange={(e) =>
                      setReviewResumeData({
                        ...reviewResumeData,
                        experience: e.target.value,
                      })
                    }
                    className="premium-input"
                    style={{ height: "120px" }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setActiveModal("none")}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={confirmResumeReview}>
                  Confirm & Generate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google Business Review Modal */}
        {activeModal === "business-review" && (
          <div className="modal-overlay">
            <div className="modal-content glass-card animate-modal">
              <div className="modal-header">
                <h3>Confirm Business Details</h3>
                <p>Details extracted directly from your Maps listing.</p>
              </div>
              <div
                className="modal-body"
                style={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  paddingRight: "6px",
                }}
              >
                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    value={reviewBizData.business_name}
                    onChange={(e) =>
                      setReviewBizData({
                        ...reviewBizData,
                        business_name: e.target.value,
                      })
                    }
                    className="premium-input"
                  />
                </div>
                <div className="form-group">
                  <label>Business Classification</label>
                  <input
                    type="text"
                    value={reviewBizData.business_type}
                    onChange={(e) =>
                      setReviewBizData({
                        ...reviewBizData,
                        business_type: e.target.value,
                      })
                    }
                    className="premium-input"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={reviewBizData.description}
                    onChange={(e) =>
                      setReviewBizData({
                        ...reviewBizData,
                        description: e.target.value,
                      })
                    }
                    className="premium-input"
                    style={{ height: "80px" }}
                  />
                </div>
                <div
                  className="form-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div className="form-group">
                    <label>Location Address</label>
                    <input
                      type="text"
                      value={reviewBizData.address}
                      onChange={(e) =>
                        setReviewBizData({
                          ...reviewBizData,
                          address: e.target.value,
                        })
                      }
                      className="premium-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <input
                      type="text"
                      value={reviewBizData.rating}
                      onChange={(e) =>
                        setReviewBizData({
                          ...reviewBizData,
                          rating: e.target.value,
                        })
                      }
                      className="premium-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Review Highlight</label>
                  <input
                    type="text"
                    value={reviewBizData.highlight_review}
                    onChange={(e) =>
                      setReviewBizData({
                        ...reviewBizData,
                        highlight_review: e.target.value,
                      })
                    }
                    className="premium-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setActiveModal("none")}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={confirmBusinessReview}>
                  Confirm & Generate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Manager Modal */}
        {activeModal === "image-manager" && (
          <div className="modal-overlay">
            <div className="modal-content glass-card image-manager-modal animate-modal">
              <div
                className="modal-header"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  paddingBottom: "1rem",
                }}
              >
                <h3
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <ImageIcon size={20} /> Personalize Images
                </h3>
                <button
                  className="close-modal-btn"
                  onClick={() => setActiveModal("none")}
                >
                  <X size={20} />
                </button>
              </div>
              <div
                className="modal-body"
                style={{
                  maxHeight: "55vh",
                  overflowY: "auto",
                  marginTop: "1rem",
                }}
              >
                {scannedImages.length === 0 ? (
                  <div
                    style={{
                      color: "var(--text-secondary)",
                      textAlign: "center",
                      padding: "2rem",
                    }}
                  >
                    Scanning layout for images...
                  </div>
                ) : (
                  scannedImages.map((imgObj, idx) => (
                    <div key={idx} className="image-item">
                      <img
                        src={imgObj.src}
                        alt={imgObj.label}
                        className="image-preview-thumb"
                      />
                      <div className="image-info">
                        <h4>{imgObj.label}</h4>
                        <p>Suggested format: WebP / PNG</p>
                      </div>
                      <div className="image-upload-wrapper">
                        <button className="btn-upload-small">Replace</button>
                        <input
                          type="file"
                          className="image-upload-input"
                          accept="image/*"
                          onChange={(e) => handleImageReplacement(e, idx)}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn-generate-premium"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setActiveModal("none")}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────
                   SIDEBARS LIST (AI Editors)
                   ───────────────────────────────────────────────── */}

        {/* AI Assistant Revision Panel */}
        {editorPanelOpen && (
          <div className="ai-editor-panel">
            <div className="ai-editor-header">
              <h3>Scalera AI Revision Suite</h3>
              <button
                className="close-editor-btn"
                onClick={() => setEditorPanelOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ai-editor-chat">
              {editorChat.map((msg, index) => (
                <div
                  key={index}
                  className={`editor-message ${msg.role === "user" ? "user" : "assistant"}`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
              {editorLoading && (
                <div className="editor-message assistant">
                  <p>Generating changes... ⚡</p>
                </div>
              )}
            </div>

            <div className="ai-editor-suggestions">
              <button
                className="suggestion-btn"
                onClick={() =>
                  handleAIEditSubmit(
                    "Change the headline to something more professional",
                  )
                }
              >
                Improve Headline
              </button>
              <button
                className="suggestion-btn"
                onClick={() =>
                  handleAIEditSubmit(
                    "Make the color scheme darker and more premium",
                  )
                }
              >
                Darker Palette
              </button>
              <button
                className="suggestion-btn"
                onClick={() =>
                  handleAIEditSubmit("Add a pricing sections container block")
                }
              >
                Add Pricing
              </button>
            </div>

            <div className="ai-editor-input-area">
              <input
                type="text"
                value={editorInput}
                onChange={(e) => setEditorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAIEditSubmit(editorInput);
                }}
                placeholder="Describe layout edits (e.g., make headers sand accent color)..."
              />
              <button onClick={() => handleAIEditSubmit(editorInput)}>
                <Send size={16} />
              </button>
            </div>

            {showEditorConfirm && (
              <div className="ai-editor-confirm">
                <p>Updates rendered in preview. Commit edits?</p>
                <div className="confirm-actions">
                  <button className="btn-confirm apply" onClick={applyAIEdit}>
                    Apply Changes
                  </button>
                  <button
                    className="btn-confirm discard"
                    onClick={discardAIEdit}
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* In-Context Section Editor Sidebar */}
        {sectionEditorOpen && (
          <div className="editor-sidebar">
            <div className="editor-header">
              <h3>
                Edit {currentEditingSection?.sectionType?.toUpperCase()} Section
              </h3>
              <button
                className="close-btn"
                onClick={() => setSectionEditorOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="editor-body">
              <div className="form-group">
                <label>Describe what to modify in this section</label>
                <textarea
                  value={sectionEditPrompt}
                  onChange={(e) => setSectionEditPrompt(e.target.value)}
                  className="premium-input"
                  placeholder="e.g. rewrite details, replace the services list, change typography style..."
                  style={{ height: "140px" }}
                />
              </div>
              {sectionEditLoading && (
                <div
                  style={{
                    textAlign: "center",
                    margin: "20px 0",
                    color: "var(--accent-color)",
                    fontSize: "0.85rem",
                  }}
                >
                  AI is updating section content... ✨
                </div>
              )}
            </div>
            <div className="editor-footer">
              {!showSectionConfirm ? (
                <button
                  className="btn-primary"
                  style={{ padding: "12px" }}
                  onClick={applySectionEdit}
                  disabled={!sectionEditPrompt.trim()}
                >
                  Rewrite Section ✨
                </button>
              ) : (
                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, padding: "12px" }}
                    onClick={keepSectionEdit}
                  >
                    Keep Changes
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, padding: "12px" }}
                    onClick={discardSectionEdit}
                  >
                    Discard Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showLoginModal && (
        <div className="login-overlay">
          <div className="login-card">
            <div className="login-logo">
              Scalera<span style={{ color: "var(--accent-color)" }}>.</span>
            </div>
            <h2>Access AI Builder</h2>
            <p>Sign in to unlock personalized website generation, custom styling engines, and live code reviews.</p>
            
            <div className="google-btn-wrapper">
              <div id="google-signin-btn"></div>
            </div>

            <div className="login-divider">
              <span>or</span>
            </div>

            <button className="demo-login-btn" onClick={handleDemoLogin}>
              Bypass with Demo Account
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={resumeUploadRef}
        style={{ display: "none" }}
        accept=".pdf,.txt,.doc,.docx"
        onChange={handleResumeUploadChange}
      />
    </div>
  );
};

// Inline helper SVG components
const UploadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{ marginRight: "2px" }}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export default ScaleraAIBuilder;
