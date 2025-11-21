export function Footer() {
  return (
    <footer className="w-full py-6 mt-12 flex items-center justify-center bg-[#05070c] border-t border-gray-800">
      <div className="v-container center-vert">
        <div className="text-sm text-[rgba(230,243,255,0.65)]">
          &copy; {new Date().getFullYear()} CyberLab. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
