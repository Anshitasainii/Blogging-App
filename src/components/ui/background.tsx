const Background = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[linear-gradient(-45deg,#ff9a9e,#fad0c4,#a18cd1,#fbc2eb)] bg-[length:400%_400%] animate-gradientFade" />

      {/* Floating blobs with CSS variable colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[hsl(var(--primary))] opacity-30 blur-3xl rounded-full animate-blob" />
      <div className="absolute top-[40%] left-[50%] w-[50vw] h-[50vw] bg-[hsl(var(--secondary))] opacity-30 blur-3xl rounded-full animate-blob animation-delay-2000" />
      <div className="absolute top-[70%] left-[10%] w-[45vw] h-[45vw] bg-[hsl(var(--accent))] opacity-30 blur-3xl rounded-full animate-blob animation-delay-4000" />
    </div>
  );
};

export default Background;
