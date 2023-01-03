import {useRouter} from 'next/router';
import React, {useEffect} from 'react';

import Footer from '@/components/footer';
import TopBarNew from '@/components/topbar-new';
import {ROUTES} from '@/configs/routes.config';
import {isBoardPage, isListDetailPage, isMyListPage} from '@/utils/check-routes';

import styles from './style.module.scss';

export default function NewLayout({children}: React.PropsWithChildren<Record<string, unknown>>) {
  useEffect(() => {
    if (window !== undefined) {
      document
        .getElementsByTagName('body')[0]
        .classList.remove("bg-[url('/image/bg-lobby-mobile.png')]", "sm:bg-[url('/image/bg-lobby.png')]");

      document.getElementsByTagName('body')[0].removeAttribute('style');
    }
  });
  const router = useRouter();
  const path = router.asPath;
  const {id} = router.query;
  console.log('🚀 ~ file: index.tsx:10 ~ ListPage ~ router', id);
  console.log('🚀 ~ file: index.tsx:10 ~ ListPage ~ router', router);
  console.log('~~~~ isMyListPage', isMyListPage(path, id as string));
  console.log(`~~~~~~ isListDetailPage`, isListDetailPage(path, id as string));
  console.log(`~~~~~~ isKanbanPage`, isBoardPage(path, id as string));

  return (
    <div className={styles['new-layout']}>
      <TopBarNew />
      <main>{children}</main>
      {router.asPath === ROUTES.LOGIN ? (
        <>
          <div className="lg:bg-slate-100">
            <Footer />
          </div>
        </>
      ) : (
        <Footer />
      )}
    </div>
  );
}
