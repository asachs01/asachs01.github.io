import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  const archives = await getCollection('archives');

  const allPosts = [...posts, ...archives]
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Aaron Sachs - Staring Blankly at a Screen',
    description: 'Tech, beer, and the occasional banjo tune',
    site: context.site,
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/p/${post.data.slug}/`,
    })),
  });
}
