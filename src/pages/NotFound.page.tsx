import NotFoundComp from '../components/NotFoundComp';

export default function NotFound() {
  // @ts-ignore
  return (
    <div>
      <NotFoundComp
        line1={'searching...'}
        line2={'404'}
        line3={'Oops! Page not found.'}
        goBackLink={'/'}
      />
    </div>
  );
}
