// "use client";

// import { useEffect } from "react";
// import Head from "next/head";

// const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// const clamp = (v: number, min: number, max: number) =>
// 	Math.min(Math.max(v, min), max);

// const preloadImages = (selector: string): Promise<void> => {
// 	const elements = Array.from(document.querySelectorAll(selector));
// 	const promises = elements.map((el) => {
// 		const style = window.getComputedStyle(el);
// 		const bgImage = style.backgroundImage;
// 		const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
// 		const url = urlMatch ? urlMatch[1] : null;
// 		if (url) {
// 			return new Promise<void>((resolve, reject) => {
// 				const img = new Image();
// 				img.src = url;
// 				img.onload = () => resolve();
// 				img.onerror = () => reject();
// 			});
// 		}
// 		return Promise.resolve();
// 	});
// 	return Promise.all(promises).then(() => {});
// };

// const splitText = (element: HTMLElement) => {
// 	const text = element.textContent || "";
// 	element.innerHTML = "";
// 	for (const char of text) {
// 		const span = document.createElement("span");
// 		span.textContent = char;
// 		element.appendChild(span);
// 	}
// };

// export default function Home() {
// 	useEffect(() => {
// 		preloadImages(".grid__item-img").then(() => {
// 			document.body.classList.remove("loading");
// 			window.scrollTo(0, 0);

// 			const updateGridItems = () => {
// 				const gridItems = document.querySelectorAll(
// 					".grid__item-imgwrap"
// 				);
// 				gridItems.forEach((el) => {
// 					const rect = el.getBoundingClientRect();
// 					const progress = clamp(
// 						(window.innerHeight - rect.top) /
// 							(window.innerHeight + rect.height),
// 						0,
// 						1
// 					);
// 					const elCenter = rect.left + rect.width / 2;
// 					const left = elCenter < window.innerWidth / 2;
// 					const rotateX = lerp(70, -50, progress);
// 					const rotateZ = left
// 						? lerp(5, -1, progress)
// 						: lerp(-5, 1, progress);
// 					const translateX = left
// 						? lerp(-40, -20, progress)
// 						: lerp(40, 20, progress);
// 					const skewX = left
// 						? lerp(-20, 10, progress)
// 						: lerp(20, -10, progress);
// 					const translateY = lerp(100, 0, progress);
// 					const blur = lerp(7, 4, progress);
// 					const contrast = lerp(400, 500, progress);
// 					(
// 						el as HTMLElement
// 					).style.transform = `perspective(1000px) translateZ(300px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) translateX(${translateX}%) skewX(${skewX}deg) translateY(${translateY}%)`;
// 					(
// 						el as HTMLElement
// 					).style.filter = `blur(${blur}px) brightness(0%) contrast(${contrast}%)`;
// 					const imgEl = el.querySelector(
// 						".grid__item-img"
// 					) as HTMLElement;
// 					if (imgEl) {
// 						imgEl.style.transform = "scaleY(1.8)";
// 					}
// 				});
// 			};

// 			const updateMarquee = () => {
// 				const grid = document.querySelector(".grid");
// 				const marqueeInner = document.querySelector(
// 					".mark > .mark__inner"
// 				) as HTMLElement;
// 				if (grid && marqueeInner) {
// 					const rect = grid.getBoundingClientRect();
// 					const progress = clamp(
// 						(window.innerHeight - rect.top) /
// 							(window.innerHeight + rect.height),
// 						0,
// 						1
// 					);
// 					const startX = window.innerWidth;
// 					const endX = -marqueeInner.offsetWidth;
// 					const currentX = lerp(startX, endX, progress);
// 					marqueeInner.style.transform = `translateX(${currentX}px)`;
// 				}
// 			};

// 			const updateSplitText = () => {
// 				const textEl = document.querySelector(".text") as HTMLElement;
// 				if (textEl) {
// 					const spans = Array.from(textEl.querySelectorAll("span"));
// 					const rect = textEl.getBoundingClientRect();
// 					const progress = clamp(
// 						(window.innerHeight - rect.top) /
// 							(window.innerHeight + rect.height),
// 						0,
// 						1
// 					);
// 					spans.forEach((span, index) => {
// 						const stagger = index * 0.04;
// 						const effectiveProgress = clamp(
// 							(progress - stagger) / (1 - stagger),
// 							0,
// 							1
// 						);
// 						const translateY = lerp(300, 0, effectiveProgress);
// 						const opacity = effectiveProgress;
// 						(
// 							span as HTMLElement
// 						).style.transform = `translateY(${translateY}%)`;
// 						(span as HTMLElement).style.opacity = `${opacity}`;
// 					});
// 				}
// 			};

// 			const updateCredits = () => {
// 				const creditsEls = document.querySelectorAll(".credits");
// 				creditsEls.forEach((el) => {
// 					if (!(el instanceof HTMLElement)) return;
// 					const spans = Array.from(el.querySelectorAll("span"));
// 					const rect = el.getBoundingClientRect();
// 					const progress = clamp(
// 						(window.innerHeight - rect.top) /
// 							(window.innerHeight + rect.height),
// 						0,
// 						1
// 					);
// 					spans.forEach((span, index) => {
// 						const stagger = index * 0.04;
// 						const effectiveProgress = clamp(
// 							(progress - stagger) / (1 - stagger),
// 							0,
// 							1
// 						);
// 						const translateX = lerp(80, 0, effectiveProgress);
// 						const opacity = effectiveProgress;
// 						(
// 							span as HTMLElement
// 						).style.transform = `translateX(${translateX}px)`;
// 						(span as HTMLElement).style.opacity = `${opacity}`;
// 					});
// 				});
// 			};

// 			const updateFullGrid = () => {
// 				const fullGridItems = document.querySelectorAll(
// 					".grid--full .grid__item"
// 				);
// 				fullGridItems.forEach((item) => {
// 					const rect = item.getBoundingClientRect();
// 					const progress = clamp(
// 						(window.innerHeight - rect.top) /
// 							(window.innerHeight + rect.height),
// 						0,
// 						1
// 					);
// 					const translateY = lerp(450, 0, progress);
// 					const opacity = lerp(0, 1, progress);
// 					(
// 						item as HTMLElement
// 					).style.transform = `translateY(${translateY}%)`;
// 					(item as HTMLElement).style.opacity = `${opacity}`;
// 				});
// 			};

// 			const updateAnimations = () => {
// 				updateGridItems();
// 				updateMarquee();
// 				updateSplitText();
// 				updateCredits();
// 				updateFullGrid();
// 			};

// 			const onScroll = () => {
// 				requestAnimationFrame(updateAnimations);
// 			};

// 			window.addEventListener("scroll", onScroll);
// 			updateAnimations();
// 			return () => window.removeEventListener("scroll", onScroll);
// 		});
// 	}, []);

// 	useEffect(() => {
// 		const textEl = document.querySelector(".text");
// 		if (textEl instanceof HTMLElement) {
// 			splitText(textEl);
// 		}
// 		const creditsEls = document.querySelectorAll(".credits");
// 		creditsEls.forEach((el) => {
// 			if (el instanceof HTMLElement) {
// 				splitText(el);
// 			}
// 		});
// 	}, []);

// 	return (
// 		<body>
// 			<Head>
// 				<title>Miveille Presents</title>
// 				<meta
// 					name="viewport"
// 					content="width=device-width, initial-scale=1"
// 				/>
// 				<style>{`
//           body.loading {
//             opacity: 0;
//             transition: opacity 0.5s ease;
//           }
//           body:not(.loading) {
//             opacity: 1;
//           }
//           .grid__item-imgwrap {
//             transition: transform 0.2s linear, filter 0.2s linear;
//           }
//           .mark > .mark__inner {
//             transition: transform 0.2s linear;
//           }
//           .text span, .credits span {
//             display: inline-block;
//             transition: transform 0.2s linear, opacity 0.2s linear;
//           }
//           .grid--full .grid__item {
//             transition: transform 0.2s linear, opacity 0.2s linear;
//           }
//         `}</style>
// 			</Head>
// 			<main className="shadow">
// 				<div className="frame">
// 					<a
// 						className="frame__back"
// 						href="https://palmaview.llc/rpalm/?p=81462"
// 					>
// 						Connect
// 					</a>
// 					<a
// 						className="frame__archive"
// 						href="https://palmaview.llc/rpalm/demos"
// 					>
// 						Gallery
// 					</a>
// 					<a
// 						className="frame__github"
// 						href="https://github.com/rpalm/Staggered3DGridAnimations"
// 					>
// 						More
// 					</a>
// 				</div>
// 				<div className="intro">
// 					<h1 className="intro__title font-alt">
// 						MIVEILLE
// 						<br />
// 						PRESENTS
// 					</h1>
// 					<nav className="tags">
// 						<a href="https://palmaview.llc/rpalm/demos/?tag=scroll">
// 							#admire
// 						</a>
// 						<a href="https://palmaview.llc/rpalm/demos/?tag=3d">
// 							#converse
// 						</a>
// 						<a href="https://palmaview.llc/rpalm/demos/?tag=grid">
// 							#observe
// 						</a>
// 					</nav>
// 					<span className="intro__info">
// 						Scroll gently &amp; enjoy
// 					</span>
// 				</div>
// 				<section>
// 					<div className="grid">
// 						{Array.from({ length: 24 }).map((_, i) => (
// 							<figure key={i} className="grid__item">
// 								<div className="grid__item-imgwrap">
// 									<div
// 										className="grid__item-img"
// 										style={{
// 											backgroundImage: `url(img/${
// 												(i % 20) + 1
// 											}.jpg)`,
// 										}}
// 									></div>
// 								</div>
// 							</figure>
// 						))}
// 					</div>
// 				</section>
// 				<div className="mark">
// 					<div className="mark__inner font-alt">
// 						{[
// 							"Ava Ravenswood",
// 							"A R",
// 							"Michellllle Jackson",
// 							"M J",
// 							"Ava Ravenswood",
// 							"A R",
// 							"Michellllle Jackson",
// 							"M J",
// 							"Ava Ravenswood",
// 							"A R",
// 							"Michellllle Jackson",
// 							"M J",
// 							"Ava Ravenswood",
// 							"A R",
// 							"Michellllle Jackson",
// 							"M J",
// 							"Ava Ravenswood",
// 							"A R",
// 							"Michellllle Jackson",
// 							"M J",
// 						].map((text, idx) => (
// 							<span key={idx}>{text}</span>
// 						))}
// 					</div>
// 				</div>
// 				<section>
// 					<div className="text font-alt">MIVEILLE</div>
// 				</section>
// 				<section>
// 					<div className="grid grid--full">
// 						{Array.from({ length: 24 }).map((_, i) => (
// 							<figure key={i} className="grid__item">
// 								<div
// 									className="grid__item-img"
// 									style={{
// 										backgroundImage: `url(img/${
// 											(i % 20) + 1
// 										}.jpg)`,
// 									}}
// 								></div>
// 							</figure>
// 						))}
// 					</div>
// 				</section>
// 				<p className="credits font-alt">
// 					Made by <a href="https://x.com/rpalm">@rpalm</a>
// 				</p>
// 				<p className="credits font-alt">
// 					<a href="https://palmaview.llc/rpalm/demos">More To See</a>
// 				</p>
// 			</main>
// 		</body>
// 	);
// }

import React from "react";

const page = () => {
	return <div>page</div>;
};

export default page;
