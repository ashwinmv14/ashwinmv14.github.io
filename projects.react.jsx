const { useState, useEffect, useMemo } = React;

function useLocalMap(key) {
  const [map, setMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(map)); }, [key, map]);
  const set = (k, v) => setMap(m => ({ ...m, [k]: v }));
  return [map, set];
}

function ImageWithFallback({ src, alt, seed }) {
  const [s, setS] = useState(src);
  return (
    <img
      className="project-img"
      src={s}
      alt={alt}
      onError={() => setS(`https://picsum.photos/seed/${encodeURIComponent(seed || alt)}/800/600`)}
    />
  );
}

function Modal({ project, images, onClose, onSelectImage }) {
  if (!project) return null;
  return (
    <div className="pm-modal" role="dialog" aria-modal="true">
      <div className="pm-modal-content">
        <button className="pm-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="pm-modal-body">
          <div className="pm-modal-left">
            <ImageWithFallback src={images[0]} alt={project.title} seed={project.title} />
          </div>
          <div className="pm-modal-right">
            <h3>{project.title}</h3>
            <p className="meta">{project.tech}</p>
            <p>{project.desc}</p>

            <div style={{marginTop:12}}>
              <h4>Gallery</h4>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {images.map((img, idx) => (
                  <div key={idx} style={{cursor:'pointer'}}>
                    <img src={img} alt={`${project.title} ${idx+1}`} style={{width:120,height:80,objectFit:'cover',borderRadius:6,border:'1px solid rgba(0,0,0,0.06)'}} onError={(e)=>{e.currentTarget.src=`https://picsum.photos/seed/${encodeURIComponent(project.title+'-'+idx)}/400/300`}} />
                    <div style={{textAlign:'center',marginTop:6}}>
                      <button className="btn" onClick={() => onSelectImage(img)}>Use as cover</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{marginTop:16,display:'flex',gap:8}}>
              <a className="btn" href={project.link || '#'} target="_blank" rel="noopener noreferrer">View repo</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsApp() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedImages, setSelectedImage] = useLocalMap('pm:selectedImages');

  useEffect(() => {
    fetch('projects.json')
      .then(r => r.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(err => { console.warn('Could not load projects.json', err); setProjects([]); });
  }, []);

  const categories = useMemo(() => ['all', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))], [projects]);

  const displayed = useMemo(() => (filter === 'all' ? projects : projects.filter(p => p.category === filter)), [projects, filter]);

  function openModal(p) { setSelectedProject(p); }
  function closeModal() { setSelectedProject(null); }
  function setCover(project, img) {
    setSelectedImage(project.title, img);
    // update UI immediately
    setProjects(prev => prev.map(p => p.title === project.title ? { ...p } : p));
    closeModal();
  }

  return (
    <div>
      <div className="project-filters" role="tablist" aria-label="Project filters" style={{marginBottom:16}}>
        {categories.map(cat => (
          <button key={cat} className={`filter-btn ${filter===cat?'active':''}`} data-filter={cat} onClick={() => setFilter(cat)} style={{marginRight:8}}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="cards">
        {displayed.length === 0 && <p className="muted">No projects yet for this category.</p>}
        {displayed.map((p, i) => {
          const imgs = Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []);
          const cover = selectedImages[p.title] || imgs[0] || `https://picsum.photos/seed/${encodeURIComponent(p.title)}/800/600`;
          return (
            <div key={i} className="card project-card" style={{position:'relative'}}>
              <div className="card-tag">{(p.category||'').toUpperCase()}</div>
              <ImageWithFallback src={cover} alt={p.title} seed={p.title} />
              <div className="card-body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="meta">{p.tech}</div>
                <div style={{marginTop:10,display:'flex',gap:8}}>
                  <button className="btn" onClick={() => openModal(p)}>Details</button>
                  <a className="btn ghost" href={p.link||'#'} target="_blank" rel="noopener noreferrer">Repo</a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        project={selectedProject}
        images={selectedProject ? (selectedProject.images || (selectedProject.image ? [selectedProject.image] : [])) : []}
        onClose={closeModal}
        onSelectImage={(img) => setCover(selectedProject, img)}
      />
    </div>
  );
}

const rootEl = document.getElementById('projects-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(React.createElement(ProjectsApp));
} else {
  console.warn('React root not found: #projects-root');
}