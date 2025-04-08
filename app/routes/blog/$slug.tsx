import path from 'path';
import { readFile } from 'fs/promises';
import { redirect, useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export async function loader({ params }: LoaderFunctionArgs) {
	const { slug } = params;
	if (!slug) {
		return redirect('/');
	}

	const mdPath = path.join(process.cwd(), 'content', `${slug}.md`);

	let markdown = '';
	try {
		markdown = await readFile(mdPath, { encoding: 'utf-8' });
	} catch {
		return redirect('/');
	}

	const content = (await remark().use(remarkHtml).process(markdown)).toString();

	return { content };
}

export default function Blog() {
	const { content } = useLoaderData<typeof loader>();

	return (
		<article>
			<div dangerouslySetInnerHTML={{ __html: content }} />
		</article>
	);
}
