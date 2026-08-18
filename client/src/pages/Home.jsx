import React from "react";
import EstimatorPage from "./EstimatorPage.jsx";
import { Phone, CheckCircle, ShieldCheck, Mail, MapPin, Award, HelpCircle } from "lucide-react";

export default function Home() {
  const scrollToEstimator = () => {
    document
      .getElementById("estimator-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* NAVBAR  */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[74px] w-[calc(100%-32px)] max-w-[1340px] items-center justify-between lg:h-[94px] lg:w-[calc(100%-80px)]">
          {/* LOGO */}
          <a
            href="/"
            className="flex w-[125px] shrink-0 flex-col leading-[0.85] no-underline lg:w-[135px]"
          >
            <span className="text-[25px] font-extrabold italic tracking-[-1.8px] text-[#0a3834] lg:text-[29px]">
              Northline
            </span>

            <span className="mt-1 pl-0.5 text-[7px] font-extrabold tracking-[2.5px] text-[#0a3834] lg:text-[8px] lg:tracking-[3px]">
              ROOFING
            </span>
          </a>

          {/* DESKTOP NAV */}
          <nav className="ml-12 hidden items-center gap-7 lg:flex xl:ml-20 xl:gap-9">
            <a
              href="#about"
              className="whitespace-nowrap text-sm font-extrabold tracking-wide text-[#092f2c] transition hover:text-slate-500"
            >
              ABOUT US
            </a>

            <a
              href="#services"
              className="whitespace-nowrap text-sm font-extrabold tracking-wide text-[#092f2c] transition hover:text-slate-500"
            >
              OUR SERVICES
            </a>

            <a
              href="#trust"
              className="whitespace-nowrap text-sm font-extrabold tracking-wide text-[#092f2c] transition hover:text-slate-500"
            >
              RESOURCES
            </a>

            <a
              href="#gallery"
              className="whitespace-nowrap text-sm font-extrabold tracking-wide text-[#092f2c] transition hover:text-slate-500"
            >
              GALLERY
            </a>
          </nav>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-2 lg:gap-3.5">
            {/* PHONE */}
            <a
              href="tel:7047969506"
              className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-extrabold text-[#092f2c] sm:text-sm lg:text-base"
            >
              <Phone size={15} />

              <span className="hidden sm:inline">
                (704) 796-9506
              </span>
            </a>

            {/* ESTIMATE */}
            <button
              type="button"
              onClick={scrollToEstimator}
              className="h-9 rounded-full bg-[#d8ff35] px-3.5 text-[10px] font-extrabold text-[#092f2c] transition hover:bg-[#c8ef20] sm:px-4 sm:text-[11px] lg:h-[43px] lg:px-6 lg:text-[13px]"
            >
              GET AN ESTIMATE
            </button>

            {/* ADMIN */}
            <a
              href="/admin"
              className="hidden h-[43px] items-center justify-center rounded-full border-2 border-[#0a3c37] px-5 text-xs font-extrabold text-[#0a3c37] no-underline transition hover:bg-[#0a3c37] hover:text-white lg:flex"
            >
              ADMIN PANEL
            </a>
          </div>
        </div>
      </header>

      {/* HERO*/}
      <section
        id="estimator-section"
        className="relative overflow-hidden bg-gradient-to-br from-[#092d29] via-[#103c37] to-[#5d706c] py-14 md:py-16 lg:min-h-[687px] lg:py-20"
      >
        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#021b18]/25 to-transparent" />

        <div className="relative z-10 mx-auto grid w-[calc(100%-32px)] max-w-[1340px] items-center gap-12 md:w-[calc(100%-40px)] lg:w-[calc(100%-80px)] lg:grid-cols-[minmax(0,1fr)_560px] lg:gap-16">
          {/* HERO TEXT */}
          <div className="w-full max-w-[700px] text-white">
            <span className="mb-4 block text-[10px] font-extrabold tracking-[1.2px] text-[#d8ff35] sm:text-xs lg:mb-6 lg:text-[13px] lg:tracking-[1.7px]">
              TRUSTED ROOF REPLACEMENT EXPERTS
            </span>

            <h1 className="mb-5 max-w-[690px] text-[36px] font-extrabold leading-[1.08] tracking-[-1.8px] text-white sm:text-[42px] md:text-[48px] lg:text-[58px] lg:leading-[1.1] lg:tracking-[-2.5px]">
              Because Having a Roof Over Your Head Matters.
            </h1>

            <p className="mb-7 max-w-[660px] text-[15px] leading-[1.6] text-white/90 sm:text-base lg:mb-9 lg:text-lg lg:leading-[1.58]">
              Tired of dealing with roof headaches? We're here to
              help! Watch as we expertly extend the life of your
              roof, providing unmatched quality and peace of mind
              while keeping your home safe and sound!
            </p>

            {/* BENEFITS */}
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0 lg:gap-4">
              <li className="flex items-center gap-2.5 text-sm font-bold text-white sm:text-[15px] lg:text-[17px]">
                <CheckCircle size={21} className="shrink-0 text-[#d8ff35]"/>
                <span>Free Estimator Tool</span>
              </li>

              <li className="flex items-center gap-2.5 text-sm font-bold text-white sm:text-[15px] lg:text-[17px]">
                <CheckCircle size={21} className="shrink-0 text-[#d8ff35]" />
                <span>Fast, Quality Service</span>
              </li>

              <li className="flex items-center gap-2.5 text-sm font-bold text-white sm:text-[15px] lg:text-[17px]">
                <CheckCircle size={21} className="shrink-0 text-[#d8ff35]"
                />
                <span>Easy Financing Options</span>
              </li>
            </ul>
          </div>

          {/* ESTIMATOR */}
          <div className="mx-auto w-full max-w-[560px] -translate-y-10">
            <EstimatorPage />
          </div>
        </div>
      </section>

      {/* FOOTER*/}
      <footer className="w-full bg-[#06231f] pt-14 text-white md:pt-[70px]">
        <div className="mx-auto grid w-[calc(100%-32px)] max-w-[1340px] gap-10 pb-10 md:w-[calc(100%-40px)] md:grid-cols-2 md:gap-12 md:pb-14 lg:w-[calc(100%-80px)] lg:grid-cols-[2fr_1fr_1.5fr] lg:gap-[70px]">
          {/* BRAND */}
          <div>
            <a
              href="/"
              className="flex w-[135px] flex-col leading-[0.85] no-underline"
            >
              <span className="text-[29px] font-extrabold italic tracking-[-1.8px] text-[#d8ff35]">
                Northline
              </span>
              <span className="mt-1 pl-0.5 text-[8px] font-extrabold tracking-[3px] text-white">
                ROOFING
              </span>
            </a>

            <p className="mt-4 max-w-[330px] text-sm leading-7 text-white/65">
              Providing top-tier commercial and residential roofing
              solutions across the Carolinas.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="mb-5 text-[15px] font-extrabold tracking-wide text-[#d8ff35]">
              Quick Links
            </h4>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              <li>
                <a href="#about" className="text-sm text-white/70 transition hover:text-[#d8ff35]"> About Us</a>
              </li>

              <li>
                <a href="#services" className="text-sm text-white/70 transition hover:text-[#d8ff35]">
                  Our Services
                </a>
              </li>

              <li>
                <a
                  href="#trust"
                  className="text-sm text-white/70 transition hover:text-[#d8ff35]"
                >
                  Warranty & Financing
                </a>
              </li>

              <li>
                <a
                  href="/admin"
                  className="text-sm text-white/70 transition hover:text-[#d8ff35]"
                >
                  Owner Portal
                </a>
              </li>
            </ul>
          </div>
          {/* CONTACT */}
          <div>
            <h4 className="mb-5 text-[15px] font-extrabold tracking-wide text-[#d8ff35]">
              Contact Northline
            </h4>

            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              <li className="flex items-start gap-2.5 text-sm leading-6 text-white/70">
                <MapPin size={16} className="mt-1 shrink-0 text-[#d8ff35]" />
                <span>
                  580 Union W Blvd, Matthews, NC 28104
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Phone size={16} className="shrink-0 text-[#d8ff35]" />
                <span>(704) 796-9506</span>
              </li>

              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Mail size={16} className="shrink-0 text-[#d8ff35]" />
                <span className="break-all">
                  contact@northlineroofing.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="border-t border-white/10 px-4 py-5 text-xs text-white/55">
          <div className="mx-auto flex w-full max-w-[1340px] flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p>
              Copyright © 2026 Northline Roofing LLC. All Rights
              Reserved.
            </p>
            <div className="flex items-center gap-2.5">
              <a href="#privacy" className="transition hover:text-[#d8ff35]" >
                Privacy Policy
              </a>
              <span>|</span>  

              <a href="#terms" className="transition hover:text-[#d8ff35]" >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}