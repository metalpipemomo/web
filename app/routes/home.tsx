import { Link } from 'react-router';
import type { Route } from './+types/home';
import { DrawingBoard } from '~/components/DrawingBoard';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Mo Baydoun' },
		{ name: 'description', content: 'One of the developers of all time.' },
	];
}

const links = [
	{
		icon: '/github.svg',
		link: 'https://github.com/metalpipemomo/',
		alt: 'Github Link',
	},
	{
		icon: '/linkedin.svg',
		link: 'https://linkedin.com/in/mo-baydoun/',
		alt: 'LinkedIn Link',
	},
] as const;

export default function Home() {
	return (
		<div
			className={
				'font-sans bg-transparent bg-opacity-5 flex flex-col m-auto items-center max-w-3xl min-h-screen gap-12 py-8'
			}
		>
			{/* Header */}
			<section className={'min-w-full'}>
				<div className={'flex flex-row justify-between'}>
					<a href="mailto:bydn.mo@gmail.com">bydn.mo@gmail.com</a>
					<div className={'flex flex-row gap-2'}>
						<Link to={'/'}>Home</Link>
						<p>/</p>
						<Link to={'/posts'}>Posts</Link>
					</div>
				</div>
			</section>
			{/* Intro */}
			<section className={'flex flex-row gap-8 justify-between'}>
				<div className={'gap-4 flex flex-col'}>
					<h1 className={'font-bold text-3xl tracking-wide'}>
						Hi, I’m <span className={'text-primary'}>Mo</span> 👋
					</h1>
					<p className={'leading-6 text-sm tracking-wide'}>
						I am a{' '}
						<span className={'text-primary font-extrabold'}>
							full-stack developer
						</span>{' '}
						with around{' '}
						<span className={'text-primary font-extrabold'}>2 years</span> of
						experience &mdash; though I have been programming for about 5 years
						overall. I mainly work with Node.js and React, which makes it no
						surprise that my favorite language is{' '}
						<span className={'text-primary font-extrabold'}>TypeScript</span>.
					</p>
					<p className={'leading-6 text-sm tracking-wide'}>
						Outside of work, I have been slowly teaching myself how to cook
						(always open to new recipes!) and I am currently infatuated with{' '}
						<span className={'text-primary font-extrabold italic'}>
							Magic: The Gathering
						</span>
						, checkout my Archidekt profile &gt;{' '}
						<a
							href="https://archidekt.com/u/metalpipemomo"
							target="_blank"
							rel="noopener noreferrer"
							className={
								'hover:cursor-pointer text-primary hover:underline decoration-black decoration-2 font-extrabold underline-offset-4'
							}
						>
							here!
						</a>{' '}
						&lt;
					</p>
					<div className={'flex flex-row gap-5 justify-start mt-auto'}>
						{links.map((entry) => {
							return (
								<Link key={entry.alt} to={entry.link}>
									<img
										className={'hover:cursor-pointer'}
										width={32}
										height={32}
										src={entry.icon}
										alt={entry.alt}
									/>
								</Link>
							);
						})}
					</div>
				</div>
				<DrawingBoard width={250} height={250} />
			</section>
			{/* Blog */}
			<section className={'min-w-full'}>
				<div className="flex flex-row justify-between">
					<h2 className={'text-lg font-bold'}>Latest posts</h2>
					<Link
						to={'/posts'}
						className={'underline decoration-dotted underline-offset-8'}
					>
						See all posts
					</Link>
				</div>
			</section>
		</div>
	);
}
