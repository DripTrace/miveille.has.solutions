"use client";

import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ trialWarn: false });

declare global {
	interface Window {
		SplitText: any;
	}
}

const preloadImages = (selector: string): Promise<void> => {
	const elements = Array.from(document.querySelectorAll(selector));
	const promises = elements.map((el) => {
		const style = window.getComputedStyle(el);
		const bgImage = style.backgroundImage;
		const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
		const url = urlMatch ? urlMatch[1] : null;
		if (url) {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				img.src = url;
				img.onload = () => resolve();
				img.onerror = () => reject();
			});
		}
		return Promise.resolve();
	});
	return Promise.all(promises).then(() => {});
};

export default function Home() {
	useEffect(() => {
		if (window.SplitText) {
			gsap.registerPlugin(window.SplitText);
		}

		const isLeftSide = (element: Element): boolean => {
			const rect = element.getBoundingClientRect();
			const elementCenter = rect.left + rect.width / 2;
			const viewportCenter = window.innerWidth / 2;
			return elementCenter < viewportCenter;
		};

		const animateScrollGrid = () => {
			const grid = document.querySelector(".grid");
			if (!grid) return;
			const gridImages = grid.querySelectorAll(".grid__item-imgwrap");
			gridImages.forEach((imageWrap) => {
				const imgEl = imageWrap.querySelector(".grid__item-img");
				const leftSide = isLeftSide(imageWrap);
				gsap.timeline({
					scrollTrigger: {
						trigger: imageWrap,
						start: "top bottom+=10%",
						end: "bottom top-=25%",
						scrub: true,
					},
				})
					.from(imageWrap, {
						startAt: {
							filter: "blur(0px) brightness(100%) contrast(100%)",
						},
						z: 300,
						rotateX: 70,
						rotateZ: leftSide ? 5 : -5,
						xPercent: leftSide ? -40 : 40,
						skewX: leftSide ? -20 : 20,
						yPercent: 100,
						filter: "blur(7px) brightness(0%) contrast(400%)",
						ease: "sine",
					})
					.to(imageWrap, {
						z: 300,
						rotateX: -50,
						rotateZ: leftSide ? -1 : 1,
						xPercent: leftSide ? -20 : 20,
						skewX: leftSide ? 10 : -10,
						filter: "blur(4px) brightness(0%) contrast(500%)",
						ease: "sine.in",
					})
					.from(
						imgEl,
						{
							scaleY: 1.8,
							ease: "sine",
						},
						0
					)
					.to(
						imgEl,
						{
							scaleY: 1.8,
							ease: "sine.in",
						},
						">"
					);
			});
		};

		const animateMarquee = () => {
			const grid = document.querySelector(".grid");
			const marqueeInner = document.querySelector(".mark > .mark__inner");
			if (!grid || !marqueeInner) return;
			gsap.timeline({
				scrollTrigger: {
					trigger: grid,
					start: "top bottom",
					end: "bottom top",
					scrub: true,
				},
			}).fromTo(
				marqueeInner,
				{ x: "100vw" },
				{ x: "-100%", ease: "sine" }
			);
		};

		const animateTextElement = () => {
			const textElement = document.querySelector(".text");
			if (!textElement || !window.SplitText) return;
			const splitTextEl = new window.SplitText(textElement, {
				type: "chars",
			});
			gsap.timeline({
				scrollTrigger: {
					trigger: textElement,
					start: "top bottom",
					end: "center center-=25%",
					scrub: true,
				},
			}).from(splitTextEl.chars, {
				ease: "sine",
				yPercent: 300,
				autoAlpha: 0,
				stagger: { each: 0.04, from: "center" },
			});
		};

		const animateGridFull = () => {
			const gridFull = document.querySelector(".grid--full");
			if (!gridFull) return;
			const gridFullItems = gridFull.querySelectorAll(".grid__item");
			const gridFullStyle = window.getComputedStyle(gridFull);
			const templateColumns = gridFullStyle.getPropertyValue(
				"grid-template-columns"
			);
			const numColumns = templateColumns.split(" ").length;
			const middleColumnIndex = Math.floor(numColumns / 2);
			const columns: Element[][] = Array.from(
				{ length: numColumns },
				() => []
			);
			gridFullItems.forEach((item, index) => {
				const columnIndex = index % numColumns;
				columns[columnIndex].push(item);
			});
			columns.forEach((columnItems, columnIndex) => {
				const delayFactor =
					Math.abs(columnIndex - middleColumnIndex) * 0.2;
				gsap.timeline({
					scrollTrigger: {
						trigger: gridFull,
						start: "top bottom",
						end: "center center",
						scrub: true,
					},
				})
					.from(columnItems, {
						yPercent: 450,
						autoAlpha: 0,
						delay: delayFactor,
						ease: "sine",
					})
					.from(
						columnItems.map((item) =>
							item.querySelector(".grid__item-img")
						),
						{ transformOrigin: "50% 0%", ease: "sine" },
						0
					);
			});
		};

		const animateCredits = () => {
			const creditsTexts = document.querySelectorAll(".credits");
			creditsTexts.forEach((creditsText) => {
				if (!window.SplitText) return;
				const splitCredits = new window.SplitText(creditsText, {
					type: "chars",
				});
				gsap.timeline({
					scrollTrigger: {
						trigger: creditsText,
						start: "top bottom",
						end: "clamp(bottom top)",
						scrub: true,
					},
				}).fromTo(
					splitCredits.chars,
					{
						x: (index: number) =>
							index * 80 - (splitCredits.chars.length * 80) / 2,
					},
					{ x: 0, ease: "sine" }
				);
			});
		};

		const init = () => {
			animateScrollGrid();
			animateMarquee();
			animateTextElement();
			animateGridFull();
			animateCredits();
		};

		preloadImages(".grid__item-img").then(() => {
			document.body.classList.remove("loading");
			init();
			window.scrollTo(0, 0);
		});
	}, []);

	return (
		<body>
			<Head>
				<title>Miveille Presents</title>
			</Head>
			<Script
				src="https://assets.codepen.io/16327/SplitText3.min.js"
				strategy="beforeInteractive"
			/>
			<main className="shadow">
				<div className="frame">
					<a
						className="frame__back"
						href="https://palmaview.llc/rpalm/?p=81462"
					>
						Connect
					</a>
					<a
						className="frame__archive"
						href="https://palmaview.llc/rpalm/demos"
					>
						Gallery
					</a>
					<a
						className="frame__github"
						href="https://github.com/rpalm/Staggered3DGridAnimations"
					>
						More
					</a>
				</div>
				<div className="intro">
					<h1 className="intro__title font-alt">
						MIVEILLE
						<br />
						PRESENTS
					</h1>
					<nav className="tags">
						<a href="https://palmaview.llc/rpalm/demos/?tag=scroll">
							#admire
						</a>
						<a href="https://palmaview.llc/rpalm/demos/?tag=3d">
							#converse
						</a>
						<a href="https://palmaview.llc/rpalm/demos/?tag=grid">
							#observe
						</a>
					</nav>
					<span className="intro__info">
						Scroll gently &amp; enjoy
					</span>
				</div>
				<section>
					<div className="grid">
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/1.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/2.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/3.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/4.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/5.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/6.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/7.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/8.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/9.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/10.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/11.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/12.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/13.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/14.jpg)",
									}}
								></div>
							</div>
						</figure>
						<figure className="grid__item">
							<div className="grid__item-imgwrap">
								<div
									className="grid__item-img"
									style={{
										backgroundImage: "url(img/15.jpg)",
									}}
								></div>
							</div>
						</figure>
					</div>
				</section>
				<div className="mark">
					<div className="mark__inner font-alt">
						<span>Ava Ravenswood</span> <span>A R</span>
						<span>Michellllle Jackson</span> <span>M J</span>
						<span>Ava Ravenswood</span> <span>A R</span>
						<span>Michellllle Jackson</span> <span>M J</span>
						<span>Ava Ravenswoodn</span> <span>A R</span>
						<span>Michellllle Jackson</span> <span>M J</span>
						<span>Ava Ravenswood</span> <span>A R</span>
						<span>Michellllle Jackson</span> <span>M J</span>
						<span>Ava Ravenswood</span> <span>A R</span>
						<span>Michellllle Jackson</span> <span>M J</span>
					</div>
				</div>
				<section>
					<div className="text font-alt">MIVEILLE</div>
				</section>
				<section>
					<div className="grid grid--full">
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/1.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/2.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/3.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/4.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/5.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/6.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/7.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/8.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/9.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/10.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/11.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/12.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/13.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/14.jpg)" }}
							></div>
						</figure>
						<figure className="grid__item">
							<div
								className="grid__item-img"
								style={{ backgroundImage: "url(img/15.jpg)" }}
							></div>
						</figure>
					</div>
				</section>
				<p className="credits font-alt">
					Made by <a href="https://x.com/rpalm">@rpalm</a>
				</p>
				<p className="credits font-alt">
					<a href="https://palmaview.llc/rpalm/demos">More To See</a>
				</p>
			</main>
		</body>
	);
}
