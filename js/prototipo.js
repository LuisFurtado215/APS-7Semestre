(function () {
  const body = document.body;

  if (!body) {
    return;
  }

  const pageId = body.dataset.page || "";
  const basePath = body.dataset.base || "";

  const STORAGE_KEYS = {
    managedCourts: "agq_managed_courts",
    reservations: "agq_reservations",
    users: "agq_users",
    currentUser: "agq_current_user",
    scheduleOverrides: "agq_schedule_overrides",
    flashToast: "agq_flash_toast",
    session: "agq_session",
  };

  const TIME_SLOTS = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const MODALITIES = ["Futebol", "Vôlei", "Beach Tennis", "Tênis"];

  const DEFAULT_SCHEDULE_TEMPLATE = {
    "08:00": { status: "Disponível" },
    "09:00": { status: "Disponível" },
    "10:00": { status: "Disponível" },
    "11:00": {
      status: "Reservado",
      cliente: "Carlos Mendes",
      telefone: "(16) 99999-0101",
      modalidade: "Beach Tennis",
    },
    "14:00": { status: "Disponível" },
    "15:00": { status: "Disponível" },
    "16:00": { status: "Bloqueado" },
    "17:00": { status: "Disponível" },
    "18:00": { status: "Disponível" },
    "19:00": {
      status: "Reservado",
      cliente: "Equipe Arena RP",
      telefone: "(16) 99888-1212",
      modalidade: "Futebol",
    },
    "20:00": { status: "Bloqueado" },
    "21:00": { status: "Disponível" },
  };

  const BASE_COURTS = [
    {
      id: 1,
      nome: "Arena Beach RP",
      modalidade: "Beach Tennis",
      bairro: "Jardim Irajá",
      cidade: "Ribeirão Preto",
      preco: 80,
      endereco: "Rua das Palmeiras, 120",
      estrutura: ["Iluminação", "Vestiário", "Estacionamento", "Ducha"],
      avaliacao: 4.8,
      horarioAbertura: "08:00",
      horarioFechamento: "22:00",
      descricao:
        "Quadra de areia com drenagem profissional, iluminação para jogos noturnos e atmosfera descontraída para partidas entre amigos.",
      imagem: "assets/img/placeholder-6.jpg",
      status: "Ativa",
    },
    {
      id: 2,
      nome: "Quadra Society Norte",
      modalidade: "Futebol",
      bairro: "Ribeirânia",
      cidade: "Ribeirão Preto",
      preco: 120,
      endereco: "Av. Independência, 950",
      estrutura: ["Gramado sintético", "Iluminação", "Lanchonete"],
      avaliacao: 4.7,
      horarioAbertura: "08:00",
      horarioFechamento: "22:00",
      descricao:
        "Campo society moderno com gramado sintético de alta qualidade, iluminação integral e apoio de lanchonete para o pós-jogo.",
      imagem: "assets/img/placeholder-6.jpg",
      status: "Ativa",
    },
    {
      id: 3,
      nome: "Tennis Club Ribeirão",
      modalidade: "Tênis",
      bairro: "Nova Aliança",
      cidade: "Ribeirão Preto",
      preco: 90,
      endereco: "Rua Projetada, 340",
      estrutura: ["Piso rápido", "Estacionamento", "Professor parceiro"],
      avaliacao: 4.9,
      horarioAbertura: "08:00",
      horarioFechamento: "22:00",
      descricao:
        "Espaço pensado para treinos técnicos e jogos casuais, com piso rápido e ambiente silencioso para melhor desempenho.",
      imagem: "assets/img/placeholder-6.jpg",
      status: "Ativa",
    },
    {
      id: 4,
      nome: "Arena Multi Esportes",
      modalidade: "Vôlei",
      bairro: "Centro",
      cidade: "Ribeirão Preto",
      preco: 70,
      endereco: "Rua São Sebastião, 455",
      estrutura: ["Quadra coberta", "Arquibancada", "Bebedouro"],
      avaliacao: 4.5,
      horarioAbertura: "08:00",
      horarioFechamento: "22:00",
      descricao:
        "Quadra coberta com ótima ventilação, arquibancada para acompanhar os jogos e estrutura ideal para treinos e amistosos.",
      imagem: "assets/img/placeholder-6.jpg",
      status: "Ativa",
    },
    {
      id: 5,
      nome: "Complexo Esportivo Bonfim",
      modalidade: "Futebol",
      bairro: "Bonfim Paulista",
      cidade: "Ribeirão Preto",
      preco: 110,
      endereco: "Av. Bonfim, 800",
      estrutura: ["Campo society", "Churrasqueira", "Estacionamento"],
      avaliacao: 4.6,
      horarioAbertura: "08:00",
      horarioFechamento: "22:00",
      descricao:
        "Complexo esportivo com clima de confraternização, campo society amplo e apoio para eventos esportivos em grupo.",
      imagem: "assets/img/placeholder-6.jpg",
      status: "Ativa",
    },
    {
      id: 6,
      nome: "Beach Point RP",
      modalidade: "Beach Tennis",
      bairro: "Jardim Irajá",
      cidade: "Ribeirão Preto",
      preco: 85,
      endereco: "Rua Chile, 220",
      estrutura: ["Areia profissional", "Iluminação", "Ducha"],
      avaliacao: 4.8,
      horarioAbertura: "08:00",
      horarioFechamento: "22:00",
      descricao:
        "Espaço jovem para beach tennis com areia profissional, ducha de apoio e iluminação preparada para partidas noturnas.",
      imagem: "assets/img/placeholder-6.jpg",
      status: "Ativa",
    },
  ];

  const BASE_RESERVATIONS = [
    {
      id: 1,
      cliente: "Mariana Souza",
      courtId: 1,
      quadra: "Arena Beach RP",
      modalidade: "Beach Tennis",
      data: "2026-05-12",
      horario: "19:00",
      valor: 80,
      status: "Confirmada",
    },
    {
      id: 2,
      cliente: "João Carvalho",
      courtId: 2,
      quadra: "Quadra Society Norte",
      modalidade: "Futebol",
      data: "2026-05-14",
      horario: "20:00",
      valor: 120,
      status: "Confirmada",
    },
    {
      id: 3,
      cliente: "Ana Ribeiro",
      courtId: 3,
      quadra: "Tennis Club Ribeirão",
      modalidade: "Tênis",
      data: "2026-05-10",
      horario: "18:00",
      valor: 90,
      status: "Concluída",
    },
  ];

  const state = {
    modalHandlers: [],
    selectedBookingTime: null,
    adminEditingCourtId: null,
  };

  const readJson = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  };

  const writeJson = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeStorage = (key) => {
    localStorage.removeItem(key);
  };

  const slugifyText = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const getBaseCourtImage = (modalidade) => {
    return "assets/img/placeholder-6.jpg";
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value || 0));

  const formatDate = (value) => {
    if (!value) {
      return "Data não definida";
    }

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
      return value;
    }

    return new Intl.DateTimeFormat("pt-BR").format(
      new Date(year, month - 1, day)
    );
  };

  const rootUrl = (path) => `${basePath}${String(path).replace(/^\//, "")}`;
  const pageUrl = (path) =>
    `${basePath}pages/${String(path).replace(/^\/?pages\//, "").replace(/^\//, "")}`;
  const assetUrl = (path) => `${basePath}${path}`;

  const statusClass = (status) => {
    const map = {
      Confirmada: "status-confirmada",
      Cancelada: "status-cancelada",
      Concluída: "status-concluida",
      Disponível: "status-disponivel",
      Reservado: "status-reservado",
      Bloqueado: "status-bloqueado",
      Ativa: "status-disponivel",
      Inativa: "status-bloqueado",
    };

    return map[status] || "";
  };

  const getTomorrowValue = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const seedStorage = () => {
    const storedCourts = readJson(STORAGE_KEYS.managedCourts, null);

    if (!storedCourts) {
      writeJson(STORAGE_KEYS.managedCourts, BASE_COURTS);
    } else {
      const baseCourtMap = new Map(BASE_COURTS.map((court) => [Number(court.id), court]));
      writeJson(
        STORAGE_KEYS.managedCourts,
        storedCourts.map((court) => {
          const baseCourt = baseCourtMap.get(Number(court.id));

          if (!baseCourt) {
            return {
              ...court,
              imagem: court.imagem || getBaseCourtImage(court.modalidade),
            };
          }

          return {
            ...court,
            imagem: baseCourt.imagem,
          };
        })
      );
    }

    if (!readJson(STORAGE_KEYS.reservations, null)) {
      writeJson(STORAGE_KEYS.reservations, BASE_RESERVATIONS);
    }

    if (!readJson(STORAGE_KEYS.users, null)) {
      writeJson(STORAGE_KEYS.users, []);
    }

    if (!readJson(STORAGE_KEYS.scheduleOverrides, null)) {
      writeJson(STORAGE_KEYS.scheduleOverrides, {});
    }
  };

  const getManagedCourts = () =>
    readJson(STORAGE_KEYS.managedCourts, BASE_COURTS).map((court) => ({
      ...court,
      estrutura: Array.isArray(court.estrutura) ? court.estrutura : [],
      imagem: court.imagem || getBaseCourtImage(court.modalidade),
      status: court.status || "Ativa",
      horarioAbertura: court.horarioAbertura || "08:00",
      horarioFechamento: court.horarioFechamento || "22:00",
    }));

  const setManagedCourts = (courts) => {
    writeJson(STORAGE_KEYS.managedCourts, courts);
  };

  const getActiveCourts = () =>
    getManagedCourts().filter((court) => court.status !== "Inativa");

  const getCourtById = (id) =>
    getManagedCourts().find((court) => Number(court.id) === Number(id));

  const getReservations = () =>
    readJson(STORAGE_KEYS.reservations, BASE_RESERVATIONS).map((reservation) => ({
      ...reservation,
      status: reservation.status || "Confirmada",
    }));

  const setReservations = (reservations) => {
    writeJson(STORAGE_KEYS.reservations, reservations);
  };

  const getCurrentUser = () => readJson(STORAGE_KEYS.currentUser, null);

  const setCurrentUser = (user) => {
    writeJson(STORAGE_KEYS.currentUser, user);
  };

  const clearSession = () => {
    removeStorage(STORAGE_KEYS.currentUser);
    removeStorage(STORAGE_KEYS.session);
  };

  const setFlashToast = (message, type = "success") => {
    writeJson(STORAGE_KEYS.flashToast, { message, type });
  };

  const consumeFlashToast = () => {
    const toast = readJson(STORAGE_KEYS.flashToast, null);
    removeStorage(STORAGE_KEYS.flashToast);
    return toast;
  };

  const syncBodyLock = () => {
    const hasAnyOpenOverlay =
      document.querySelector(".shared-modal.is-open") ||
      document.querySelector(".modal.is-open");

    body.classList.toggle("modal-open", Boolean(hasAnyOpenOverlay));
  };

  const ensureToastStack = () => {
    let stack = document.getElementById("app-toast-stack");

    if (!stack) {
      stack = document.createElement("div");
      stack.id = "app-toast-stack";
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }

    return stack;
  };

  const showToast = (message, type = "success") => {
    const stack = ensureToastStack();
    const toast = document.createElement("div");
    toast.className = `app-toast app-toast-${type}`;
    toast.innerHTML = `
      <strong>${type === "error" ? "Atenção" : "Sucesso"}</strong>
      <span>${message}</span>
    `;
    stack.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("is-visible"));

    window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 260);
    }, 3200);
  };

  const ensureSharedModal = () => {
    let modal = document.getElementById("shared-modal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "shared-modal";
      modal.className = "shared-modal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="shared-modal-backdrop" data-shared-close></div>
        <div class="shared-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="shared-modal-title">
          <button class="shared-modal-close" type="button" aria-label="Fechar" data-shared-close>&times;</button>
          <h3 id="shared-modal-title"></h3>
          <div class="shared-modal-content" id="shared-modal-content"></div>
          <div class="shared-modal-actions" id="shared-modal-actions"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    return modal;
  };

  const closeSharedModal = () => {
    const modal = ensureSharedModal();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    state.modalHandlers = [];
    syncBodyLock();
  };

  const showModal = ({ title, text, html, actions = [] }) => {
    const modal = ensureSharedModal();
    const titleNode = modal.querySelector("#shared-modal-title");
    const contentNode = modal.querySelector("#shared-modal-content");
    const actionsNode = modal.querySelector("#shared-modal-actions");

    titleNode.textContent = title || "Aviso";
    contentNode.innerHTML = html || (text ? `<p>${text}</p>` : "");
    actionsNode.innerHTML = "";
    state.modalHandlers = actions.map((action) => action.onClick || null);

    actions.forEach((action, index) => {
      const button = document.createElement(action.href ? "a" : "button");
      button.className = `button ${action.variant === "secondary" ? "btn-secondary" : "btn-primary"}`;
      button.textContent = action.label;

      if (action.href) {
        button.href = action.href;
      } else {
        button.type = "button";
        button.dataset.sharedAction = String(index);
      }

      actionsNode.appendChild(button);
    });

    if (!actions.length) {
      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "button btn-secondary";
      closeButton.textContent = "Fechar";
      closeButton.dataset.sharedClose = "";
      actionsNode.appendChild(closeButton);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    syncBodyLock();
  };

  const showBookingAuthModal = (courtId) => {
    const court = getCourtById(courtId);

    showModal({
      title: court ? `Reservar ${court.nome}` : "Reservar quadra",
      html: `
        <p>Para reservar uma quadra, entre ou crie sua conta.</p>
      `,
      actions: [
        {
          label: "Entrar",
          variant: "primary",
          href: pageUrl("login.html"),
        },
        {
          label: "Criar conta",
          variant: "secondary",
          href: pageUrl("cadastro.html"),
        },
      ],
    });
  };

  const buildBookingAction = (court) => {
    if (getCurrentUser()) {
      return `<a class="button btn-primary" href="${pageUrl(`pages/agendamento.html?id=${court.id}`)}">Agendar horário</a>`;
    }

    return `<button class="button btn-primary" type="button" data-booking-gate="${court.id}">Agendar horário</button>`;
  };

  const saveScheduleOverrides = (value) => {
    writeJson(STORAGE_KEYS.scheduleOverrides, value);
  };

  const getScheduleOverrides = () =>
    readJson(STORAGE_KEYS.scheduleOverrides, {});

  const getSchedule = (courtId, date) => {
    const overrides = getScheduleOverrides();
    const key = `${courtId}_${date}`;
    const reservations = getReservations();
    const court = getCourtById(courtId);
    const schedule = TIME_SLOTS.map((time) => {
      const template = DEFAULT_SCHEDULE_TEMPLATE[time] || { status: "Disponível" };
      return {
        horario: time,
        status: template.status,
        cliente: template.cliente || "",
        telefone: template.telefone || "",
        modalidade: template.modalidade || court?.modalidade || "",
      };
    });

    const reservationSlots = reservations.filter(
      (reservation) =>
        Number(reservation.courtId) === Number(courtId) &&
        reservation.data === date &&
        reservation.status === "Confirmada"
    );

    reservationSlots.forEach((reservation) => {
      const slot = schedule.find((item) => item.horario === reservation.horario);

      if (slot) {
        slot.status = "Reservado";
        slot.cliente = reservation.cliente;
        slot.telefone = reservation.telefone || "(16) 99999-0000";
        slot.modalidade = reservation.modalidade;
      }
    });

    const customForDay = overrides[key] || {};

    schedule.forEach((slot) => {
      const customState = customForDay[slot.horario];

      if (customState) {
        slot.status = customState.status;
        slot.cliente = customState.cliente || slot.cliente;
        slot.telefone = customState.telefone || slot.telefone;
        slot.modalidade = customState.modalidade || slot.modalidade;
      }
    });

    return schedule;
  };

  const setScheduleStatus = (courtId, date, time, status) => {
    const overrides = getScheduleOverrides();
    const key = `${courtId}_${date}`;
    const court = getCourtById(courtId);
    const current = overrides[key] || {};

    current[time] = {
      status,
      modalidade: court?.modalidade || "",
      cliente:
        status === "Reservado" ? "Reserva Manual" : current[time]?.cliente || "",
      telefone: current[time]?.telefone || "",
    };

    overrides[key] = current;
    saveScheduleOverrides(overrides);
  };

  const createReservation = (reservation) => {
    const reservations = getReservations();
    const nextId =
      reservations.length > 0
        ? Math.max(...reservations.map((item) => Number(item.id))) + 1
        : 1;

    const payload = {
      id: nextId,
      status: "Confirmada",
      ...reservation,
    };

    reservations.unshift(payload);
    setReservations(reservations);
    return payload;
  };

  const updateReservationStatus = (reservationId, status) => {
    const reservations = getReservations().map((reservation) =>
      Number(reservation.id) === Number(reservationId)
        ? { ...reservation, status }
        : reservation
    );

    setReservations(reservations);
  };

  const getCountsBy = (items, key) =>
    items.reduce((accumulator, item) => {
      const groupKey = item[key] || "Outros";
      accumulator[groupKey] = (accumulator[groupKey] || 0) + 1;
      return accumulator;
    }, {});

  const groupRevenueByWeek = (reservations) =>
    reservations.reduce((accumulator, reservation) => {
      const date = reservation.data.split("-")[2] || "01";
      const day = Number(date);
      let bucket = "Semana 1";

      if (day > 7 && day <= 14) bucket = "Semana 2";
      if (day > 14 && day <= 21) bucket = "Semana 3";
      if (day > 21) bucket = "Semana 4";

      accumulator[bucket] = (accumulator[bucket] || 0) + Number(reservation.valor || 0);
      return accumulator;
    }, {});

  const ensureHeaderBehavior = () => {
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(
      '.nav-menu a, .brand[href], .header-cta[href], .footer-links a[href], [data-scroll-target]'
    );

    if (header) {
      const syncHeader = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
      };

      syncHeader();
      window.addEventListener("scroll", syncHeader);
    }

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("is-open");
        navToggle.classList.toggle("is-active", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          const href = link.getAttribute("href");

          if (href && href.startsWith("#")) {
            const target = document.querySelector(href);

            if (target) {
              event.preventDefault();
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }

          navToggle.classList.remove("is-active");
          navToggle.setAttribute("aria-expanded", "false");
          navMenu.classList.remove("is-open");
        });
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 1120) {
          navToggle.classList.remove("is-active");
          navToggle.setAttribute("aria-expanded", "false");
          navMenu.classList.remove("is-open");
        }
      });
    }
  };

  const wireSharedModalEvents = () => {
    document.addEventListener("click", (event) => {
      const closeTrigger = event.target.closest("[data-shared-close]");

      if (closeTrigger) {
        closeSharedModal();
      }

      const actionTrigger = event.target.closest("[data-shared-action]");

      if (actionTrigger) {
        const handlerIndex = Number(actionTrigger.dataset.sharedAction);
        const handler = state.modalHandlers[handlerIndex];

        if (typeof handler === "function") {
          handler();
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSharedModal();
      }
    });
  };

  const buildFacilityBadges = (items) =>
    items
      .map((item) => `<span class="tag-pill">${item}</span>`)
      .join("");

  const initLoginPage = () => {
    const form = document.getElementById("login-form");
    const roleButtons = document.querySelectorAll("[data-access-role]");
    const typeInput = document.getElementById("access-role");
    const message = document.getElementById("login-message");
    const signupLinks = document.querySelectorAll("[data-signup-link]");
    const forgotPasswordLink = document.querySelector("[data-forgot-password]");

    if (!form || !typeInput || !message) {
      return;
    }

    const syncSignupLinks = () => {
      const isAdmin = typeInput.value === "admin";
      const signupHref = isAdmin
        ? pageUrl("cadastro-proprietario.html")
        : pageUrl("cadastro.html");

      signupLinks.forEach((link) => {
        link.href = signupHref;
        link.textContent = "Criar conta";
      });
    };

    roleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        roleButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        typeInput.value = button.dataset.accessRole;
        syncSignupLinks();
      });
    });

    syncSignupLinks();

    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", (event) => {
        event.preventDefault();

        const isAdmin = typeInput.value === "admin";
        const email = form.email.value.trim();
        const emailLabel = email ? `<strong>${email}</strong>` : "o e-mail informado";

        showModal({
          title: "Recuperação de senha",
          html: isAdmin
            ? `<p>A recuperação de acesso do proprietário é tratada pela área administrativa.</p><p>Use ${emailLabel} para continuar a redefinição da senha.</p>`
            : `<p>O link de recuperação será enviado para ${emailLabel}.</p><p>Preencha o e-mail antes de continuar para receber a orientação correta.</p>`,
        });
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = form.email.value.trim();
      const senha = form.senha.value.trim();
      const role = typeInput.value || "cliente";

      if (!email || !senha) {
        message.textContent = "Preencha e-mail e senha para continuar.";
        message.className = "form-message is-error";
        return;
      }

      const nameFromEmail =
        email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) ||
        "Usuário";

      setCurrentUser({
        name: role === "admin" ? "Gestor Agendei" : nameFromEmail,
        email,
        role: role === "admin" ? "Proprietário" : "Cliente",
      });

      writeJson(STORAGE_KEYS.session, {
        role,
        email,
        updatedAt: Date.now(),
      });

      setFlashToast(
        role === "admin"
          ? "Acesso administrativo liberado com sucesso."
          : "Login realizado com sucesso!",
        "success"
      );

      window.location.href =
        role === "admin"
          ? pageUrl("admin-dashboard.html")
          : pageUrl("quadras.html");
    });
  };

  const initCadastroPage = () => {
    const form = document.getElementById("cadastro-form");
    const message = document.getElementById("cadastro-message");

    if (!form || !message) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const fields = Array.from(form.querySelectorAll("input[required]"));
      const hasEmptyField = fields.some((field) => !field.value.trim());
      const senha = form.senha.value.trim();
      const confirmarSenha = form.confirmarSenha.value.trim();
      const modalidades = Array.from(
        form.querySelectorAll('input[name="interesses"]:checked')
      ).map((input) => input.value);

      if (hasEmptyField) {
        message.textContent = "Preencha todos os campos obrigatórios.";
        message.className = "form-message is-error";
        return;
      }

      if (senha !== confirmarSenha) {
        message.textContent = "As senhas informadas não coincidem.";
        message.className = "form-message is-error";
        return;
      }

      const users = readJson(STORAGE_KEYS.users, []);
      const user = {
        id: Date.now(),
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        telefone: form.telefone.value.trim(),
        cidade: "Ribeirão Preto",
        role: "cliente",
        interesses: modalidades,
      };

      users.push(user);
      writeJson(STORAGE_KEYS.users, users);
      setCurrentUser({
        name: user.nome,
        email: user.email,
        role: "Cliente",
      });
      writeJson(STORAGE_KEYS.session, {
        role: "cliente",
        email: user.email,
        updatedAt: Date.now(),
      });
      setFlashToast("Conta criada com sucesso! Bem-vindo ao Agendei Quadras.", "success");
      window.location.href = pageUrl("quadras.html");
    });
  };

  const initOwnerCadastroPage = () => {
    const form = document.getElementById("cadastro-proprietario-form");
    const message = document.getElementById("cadastro-proprietario-message");

    if (!form || !message) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const fields = Array.from(form.querySelectorAll("input[required]"));
      const hasEmptyField = fields.some((field) => !field.value.trim());
      const senha = form.senha.value.trim();
      const confirmarSenha = form.confirmarSenha.value.trim();

      if (hasEmptyField) {
        message.textContent = "Preencha todos os campos obrigatórios.";
        message.className = "form-message is-error";
        return;
      }

      if (senha !== confirmarSenha) {
        message.textContent = "As senhas informadas não coincidem.";
        message.className = "form-message is-error";
        return;
      }

      const users = readJson(STORAGE_KEYS.users, []);
      const owner = {
        id: Date.now(),
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        telefone: form.telefone.value.trim(),
        cidade: "Ribeirão Preto",
        role: "admin",
      };

      users.push(owner);
      writeJson(STORAGE_KEYS.users, users);
      setCurrentUser({
        name: owner.nome,
        email: owner.email,
        role: "Proprietário",
      });
      writeJson(STORAGE_KEYS.session, {
        role: "admin",
        email: owner.email,
        updatedAt: Date.now(),
      });
      setFlashToast("Cadastro de proprietário concluído com sucesso.", "success");
      window.location.href = pageUrl("admin-dashboard.html");
    });
  };

  const buildCourtCard = (court) => `
    <article class="app-card court-card">
      <img class="card-cover" src="${assetUrl(court.imagem)}" alt="${court.nome}" />
      <div class="card-body">
        <div class="card-head">
          <div class="court-card-copy">
            <h3>${court.nome}</h3>
            <p class="court-meta">${court.modalidade} • ${court.bairro}</p>
          </div>
          <span class="price-badge">${formatCurrency(court.preco)}/hora</span>
        </div>
        <div class="tag-row">${buildFacilityBadges(court.estrutura)}</div>
        <div class="inline-actions">
          <a class="button btn-secondary" href="${pageUrl(`pages/detalhes-quadra.html?id=${court.id}`)}">Ver detalhes</a>
          ${buildBookingAction(court)}
        </div>
      </div>
    </article>
  `;

  const initQuadrasPage = () => {
    const listNode = document.getElementById("quadras-list");
    const emptyNode = document.getElementById("quadras-empty");
    const searchInput = document.getElementById("filtro-busca");
    const modalitySelect = document.getElementById("filtro-modalidade");
    const neighborhoodSelect = document.getElementById("filtro-bairro");
    const dateInput = document.getElementById("filtro-data");
    const priceSelect = document.getElementById("filtro-preco");
    const applyButton = document.getElementById("aplicar-filtros");
    const clearButton = document.getElementById("limpar-filtros");
    const cityNotice = document.getElementById("city-notice");

    if (!listNode || !emptyNode) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const cityParam = slugifyText(params.get("city") || "ribeirao preto");

    if (cityParam && cityParam !== "ribeirao preto" && cityNotice) {
      cityNotice.textContent =
        "Atualmente exibimos quadras disponíveis em Ribeirão Preto/SP.";
      showToast("Exibindo quadras disponíveis em Ribeirão Preto/SP.", "error");
    }

    const applyFilters = () => {
      const term = slugifyText(searchInput?.value || "");
      const modalidade = modalitySelect?.value || "Todos";
      const bairro = neighborhoodSelect?.value || "Todos";
      const data = dateInput?.value || "";
      const price = priceSelect?.value || "Todos";

      const filtered = getActiveCourts().filter((court) => {
        const matchesTerm =
          !term ||
          slugifyText(court.nome).includes(term) ||
          slugifyText(court.bairro).includes(term) ||
          slugifyText(court.modalidade).includes(term);

        const matchesModalidade =
          modalidade === "Todos" || court.modalidade === modalidade;
        const matchesBairro = bairro === "Todos" || court.bairro === bairro;
        const matchesDate =
          !data ||
          getSchedule(court.id, data).some((slot) => slot.status === "Disponível");

        const matchesPrice =
          price === "Todos" ||
          (price === "ate-80" && court.preco <= 80) ||
          (price === "81-100" && court.preco > 80 && court.preco <= 100) ||
          (price === "101-plus" && court.preco >= 101);

        return (
          matchesTerm &&
          matchesModalidade &&
          matchesBairro &&
          matchesDate &&
          matchesPrice
        );
      });

      listNode.innerHTML = filtered.map(buildCourtCard).join("");
      emptyNode.hidden = filtered.length > 0;
    };

    const clearFilters = () => {
      if (searchInput) {
        searchInput.value = "";
      }

      if (modalitySelect) {
        modalitySelect.value = "Todos";
      }

      if (neighborhoodSelect) {
        neighborhoodSelect.value = "Todos";
      }

      if (priceSelect) {
        priceSelect.value = "Todos";
      }

      if (dateInput) {
        dateInput.value = getTomorrowValue();
      }

      applyFilters();
    };

    [searchInput, modalitySelect, neighborhoodSelect, dateInput, priceSelect].forEach(
      (field) => {
        if (field) {
          field.addEventListener("input", applyFilters);
          field.addEventListener("change", applyFilters);
        }
      }
    );

    if (applyButton) {
      applyButton.addEventListener("click", applyFilters);
    }

    if (clearButton) {
      clearButton.addEventListener("click", clearFilters);
    }

    listNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-booking-gate]");

      if (!trigger) {
        return;
      }

      event.preventDefault();
      showBookingAuthModal(trigger.dataset.bookingGate);
    });

    if (dateInput && !dateInput.value) {
      dateInput.value = getTomorrowValue();
    }

    applyFilters();
  };

  const initDetalhesPage = () => {
    const container = document.getElementById("detalhes-quadra");

    if (!container) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const court = getCourtById(params.get("id")) || getActiveCourts()[0];

    if (!court) {
      return;
    }

    container.innerHTML = `
      <div class="detail-hero">
        <img src="${assetUrl(court.imagem)}" alt="${court.nome}" />
        <div class="detail-summary app-card">
          <span class="eyebrow eyebrow-dark">Ribeirão Preto/SP</span>
          <h1>${court.nome}</h1>
          <p class="detail-subtitle">${court.modalidade} • ${court.bairro}</p>
          <div class="rating-box">
            <strong>${court.avaliacao.toFixed(1)} estrelas</strong>
            <span>Baseado em 123 avaliações</span>
          </div>
          <div class="detail-grid">
            <div>
              <span class="detail-label">Endereço</span>
              <p>${court.endereco}</p>
            </div>
            <div>
              <span class="detail-label">Funcionamento</span>
              <p>${court.horarioAbertura} às ${court.horarioFechamento}</p>
            </div>
            <div>
              <span class="detail-label">Preço</span>
              <p>${formatCurrency(court.preco)} por hora</p>
            </div>
          </div>
          <p>${court.descricao}</p>
          <div class="tag-row">${buildFacilityBadges([
            ...court.estrutura,
            "Bebedouro",
            "Iluminação",
          ])}</div>
          <div class="rules-card">
            <h3>Regras da quadra</h3>
            <ul class="info-list">
              <li>Tolerância de atraso de 10 minutos.</li>
              <li>Cancelamento permitido com até 2 horas de antecedência.</li>
              <li>Uso obrigatório de calçado adequado.</li>
            </ul>
          </div>
          <div class="inline-actions">
            ${buildBookingAction(court)}
            <a class="button btn-secondary" href="${pageUrl("pages/quadras.html")}">Voltar para quadras</a>
          </div>
        </div>
      </div>
    `;

    container.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-booking-gate]");

      if (!trigger) {
        return;
      }

      event.preventDefault();
      showBookingAuthModal(trigger.dataset.bookingGate);
    });
  };

  const initAgendamentoPage = () => {
    const summaryNode = document.getElementById("agendamento-quadra");
    const slotsNode = document.getElementById("schedule-grid");
    const form = document.getElementById("agendamento-form");
    const bookingDate = document.getElementById("booking-date");
    const bookingModalidade = document.getElementById("booking-modalidade");
    const recapNode = document.getElementById("booking-recap");

    if (!summaryNode || !slotsNode || !form || !bookingDate || !recapNode) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const court = getCourtById(params.get("id")) || getActiveCourts()[0];

    if (!court) {
      return;
    }

    state.selectedBookingTime = null;
    bookingDate.value = getTomorrowValue();
    bookingModalidade.value = court.modalidade;

    summaryNode.innerHTML = `
      <div class="app-card booking-court-card">
        <img class="card-cover" src="${assetUrl(court.imagem)}" alt="${court.nome}" />
        <div class="card-body">
          <h2>${court.nome}</h2>
          <p>${court.modalidade} • ${court.bairro}</p>
          <div class="tag-row">${buildFacilityBadges(court.estrutura.slice(0, 4))}</div>
          <strong class="price-inline">${formatCurrency(court.preco)}/hora</strong>
        </div>
      </div>
    `;

    const renderRecap = () => {
      recapNode.innerHTML = `
        <div class="recap-item">
          <span>Quadra</span>
          <strong>${court.nome}</strong>
        </div>
        <div class="recap-item">
          <span>Data</span>
          <strong>${bookingDate.value ? formatDate(bookingDate.value) : "Selecione"}</strong>
        </div>
        <div class="recap-item">
          <span>Horário</span>
          <strong>${state.selectedBookingTime || "Selecione"}</strong>
        </div>
        <div class="recap-item">
          <span>Valor</span>
          <strong>${formatCurrency(court.preco)}</strong>
        </div>
      `;
    };

    const renderSchedule = () => {
      const schedule = getSchedule(court.id, bookingDate.value);
      slotsNode.innerHTML = "";

      schedule.forEach((slot) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `time-slot ${slot.status === "Disponível" ? "is-available" : "is-disabled"} ${state.selectedBookingTime === slot.horario ? "is-selected" : ""}`;
        button.textContent = slot.horario;
        button.dataset.time = slot.horario;
        button.dataset.status = slot.status;

        if (slot.status !== "Disponível") {
          button.disabled = true;
          button.insertAdjacentHTML(
            "beforeend",
            `<span class="slot-state">${slot.status}</span>`
          );
        }

        slotsNode.appendChild(button);
      });

      renderRecap();
    };

    bookingDate.addEventListener("change", () => {
      state.selectedBookingTime = null;
      renderSchedule();
    });

    slotsNode.addEventListener("click", (event) => {
      const button = event.target.closest(".time-slot");

      if (!button || button.disabled) {
        return;
      }

      state.selectedBookingTime = button.dataset.time;
      renderSchedule();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!bookingDate.value || !state.selectedBookingTime) {
        showToast("Selecione a data e um horário disponível.", "error");
        return;
      }

      const user = getCurrentUser();

      if (!user) {
        showBookingAuthModal(court.id);
        return;
      }

      createReservation({
        cliente: user?.name || "Usuário Agendei Quadras",
        telefone: form.quantidadeJogadores.value ? "(16) 99999-0000" : "",
        courtId: court.id,
        quadra: court.nome,
        modalidade: bookingModalidade.value || court.modalidade,
        data: bookingDate.value,
        horario: state.selectedBookingTime,
        valor: court.preco,
      });

      showModal({
        title: "Reserva realizada com sucesso!",
        html: `
          <p>Seu horário em <strong>${court.nome}</strong> foi registrado com sucesso.</p>
        `,
        actions: [
          {
            label: "Ver minhas reservas",
            variant: "primary",
            onClick: () => {
              closeSharedModal();
              window.location.href = pageUrl("pages/minhas-reservas.html");
            },
          },
        ],
      });
    });

    renderSchedule();
  };

  const initReservasPage = () => {
    const listNode = document.getElementById("reservas-list");

    if (!listNode) {
      return;
    }

    const renderReservations = () => {
      const reservations = getReservations();

      listNode.innerHTML = reservations
        .map((reservation) => {
          const court = getCourtById(reservation.courtId) || {};

          return `
            <article class="app-card reservation-card">
              <div class="reservation-head">
                <div>
                  <h3>${reservation.quadra}</h3>
                  <p>${reservation.modalidade} • ${formatDate(reservation.data)} às ${reservation.horario}</p>
                </div>
                <span class="status-pill ${statusClass(reservation.status)}">${reservation.status}</span>
              </div>
              <div class="reservation-meta">
                <span><strong>Cliente:</strong> ${reservation.cliente}</span>
                <span><strong>Valor:</strong> ${formatCurrency(reservation.valor)}</span>
              </div>
              <div class="inline-actions">
                ${
                  reservation.status === "Confirmada"
                    ? `<button class="button btn-secondary" type="button" data-cancel-reserva="${reservation.id}">Cancelar reserva</button>`
                    : `<button class="button btn-secondary" type="button" disabled>${reservation.status}</button>`
                }
                <a class="button btn-primary" href="${pageUrl(`pages/agendamento.html?id=${court.id || reservation.courtId}`)}">Agendar novamente</a>
              </div>
            </article>
          `;
        })
        .join("");
    };

    listNode.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cancel-reserva]");

      if (!button) {
        return;
      }

      const reservationId = Number(button.dataset.cancelReserva);
      showModal({
        title: "Cancelar reserva",
        text: "Tem certeza que deseja cancelar esta reserva?",
        actions: [
          {
            label: "Sim, cancelar",
            variant: "primary",
            onClick: () => {
              updateReservationStatus(reservationId, "Cancelada");
              closeSharedModal();
              renderReservations();
              showToast("Reserva cancelada com sucesso.", "success");
            },
          },
          {
            label: "Voltar",
            variant: "secondary",
            onClick: () => closeSharedModal(),
          },
        ],
      });
    });

    renderReservations();
  };

  const initAdminDashboard = () => {
    const metricsNode = document.getElementById("admin-metrics");
    const tableNode = document.getElementById("admin-upcoming");
    const chartNode = document.getElementById("admin-chart");

    if (!metricsNode || !tableNode || !chartNode) {
      return;
    }

    const reservations = getReservations();
    const activeCourts = getActiveCourts();
    const byModality = getCountsBy(reservations, "modalidade");
    const revenue = reservations.reduce(
      (sum, reservation) =>
        reservation.status !== "Cancelada" ? sum + Number(reservation.valor || 0) : sum,
      0
    );

    metricsNode.innerHTML = `
      <article class="app-card stat-card"><span>Reservas hoje</span><strong>18</strong></article>
      <article class="app-card stat-card"><span>Horários disponíveis</span><strong>42</strong></article>
      <article class="app-card stat-card"><span>Cancelamentos no mês</span><strong>7</strong></article>
      <article class="app-card stat-card"><span>Faturamento estimado</span><strong>${formatCurrency(8450)}</strong></article>
      <article class="app-card stat-card"><span>Modalidade mais buscada</span><strong>Beach Tennis</strong></article>
    `;

    tableNode.innerHTML = reservations
      .slice(0, 5)
      .map(
        (reservation) => `
          <tr>
            <td>${reservation.cliente}</td>
            <td>${reservation.quadra}</td>
            <td>${reservation.modalidade}</td>
            <td>${formatDate(reservation.data)}</td>
            <td>${reservation.horario}</td>
            <td><span class="status-pill ${statusClass(reservation.status)}">${reservation.status}</span></td>
          </tr>
        `
      )
      .join("");

    const maxValue = Math.max(...Object.values(byModality), 1);
    chartNode.innerHTML = MODALITIES.map((modalidade) => {
      const value = byModality[modalidade] || 0;
      const width = Math.max((value / maxValue) * 100, value ? 18 : 10);
      return `
        <div class="chart-row">
          <span>${modalidade}</span>
          <div class="chart-bar"><div style="width:${width}%"></div></div>
          <strong>${value}</strong>
        </div>
      `;
    }).join("");

    const adminTotals = document.getElementById("admin-summary-note");

    if (adminTotals) {
      adminTotals.textContent = `${activeCourts.length} quadras ativas • ${reservations.length} reservas confirmadas • ${formatCurrency(revenue)} em receita projetada.`;
    }
  };

  const initAdminCourts = () => {
    const form = document.getElementById("admin-court-form");
    const tableNode = document.getElementById("admin-courts-table");
    const formTitle = document.getElementById("admin-court-form-title");

    if (!form || !tableNode) {
      return;
    }

    const collectStructure = () =>
      Array.from(form.querySelectorAll('input[name="estrutura"]:checked')).map(
        (input) => input.value
      );

    const fillForm = (court) => {
      form.nome.value = court.nome;
      form.modalidade.value = court.modalidade;
      form.bairro.value = court.bairro;
      form.endereco.value = court.endereco;
      form.preco.value = court.preco;
      form.abertura.value = court.horarioAbertura;
      form.fechamento.value = court.horarioFechamento;
      form.status.value = court.status;
      form.querySelectorAll('input[name="estrutura"]').forEach((checkbox) => {
        checkbox.checked = court.estrutura.includes(checkbox.value);
      });
      state.adminEditingCourtId = court.id;

      if (formTitle) {
        formTitle.textContent = `Editando: ${court.nome}`;
      }

      form.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const resetFormState = () => {
      state.adminEditingCourtId = null;
      form.reset();

      if (formTitle) {
        formTitle.textContent = "Cadastrar nova quadra";
      }
    };

    const renderTable = () => {
      const rows = getManagedCourts();

      tableNode.innerHTML = rows
        .map(
          (court) => `
            <tr>
              <td>${court.nome}</td>
              <td>${court.modalidade}</td>
              <td>${court.bairro}</td>
              <td>${formatCurrency(court.preco)}</td>
              <td><span class="status-pill ${statusClass(court.status)}">${court.status}</span></td>
              <td>
                <div class="table-actions">
                  <button type="button" class="table-link" data-edit-court="${court.id}">Editar</button>
                  <button type="button" class="table-link" data-toggle-court="${court.id}">${court.status === "Ativa" ? "Inativar" : "Ativar"}</button>
                  <button type="button" class="table-link danger" data-delete-court="${court.id}">Excluir</button>
                </div>
              </td>
            </tr>
          `
        )
        .join("");
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.nome.value.trim() || !form.modalidade.value || !form.bairro.value) {
        showToast("Preencha os dados principais da quadra.", "error");
        return;
      }

      const courts = getManagedCourts();
      const payload = {
        id:
          state.adminEditingCourtId ||
          (courts.length ? Math.max(...courts.map((item) => Number(item.id))) + 1 : 1),
        nome: form.nome.value.trim(),
        modalidade: form.modalidade.value,
        bairro: form.bairro.value,
        cidade: "Ribeirão Preto",
        preco: Number(form.preco.value || 0),
        endereco: form.endereco.value.trim(),
        estrutura: collectStructure(),
        avaliacao: 4.7,
        horarioAbertura: form.abertura.value || "08:00",
        horarioFechamento: form.fechamento.value || "22:00",
        descricao:
          "Quadra cadastrada pelo gestor para disponibilização na plataforma.",
        imagem: getBaseCourtImage(form.modalidade.value),
        status: form.status.value || "Ativa",
      };

      const updatedCourts = state.adminEditingCourtId
        ? courts.map((court) =>
            Number(court.id) === Number(state.adminEditingCourtId) ? payload : court
          )
        : [...courts, payload];

      setManagedCourts(updatedCourts);
      renderTable();
      resetFormState();
      showToast("Quadra salva com sucesso.", "success");
    });

    tableNode.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-edit-court]");
      const toggleButton = event.target.closest("[data-toggle-court]");
      const deleteButton = event.target.closest("[data-delete-court]");
      const courts = getManagedCourts();

      if (editButton) {
        const court = courts.find(
          (item) => Number(item.id) === Number(editButton.dataset.editCourt)
        );

        if (court) {
          fillForm(court);
        }
      }

      if (toggleButton) {
        const updated = courts.map((court) =>
          Number(court.id) === Number(toggleButton.dataset.toggleCourt)
            ? { ...court, status: court.status === "Ativa" ? "Inativa" : "Ativa" }
            : court
        );

        setManagedCourts(updated);
        renderTable();
        showToast("Status da quadra atualizado.", "success");
      }

      if (deleteButton) {
        const updated = courts.filter(
          (court) => Number(court.id) !== Number(deleteButton.dataset.deleteCourt)
        );

        setManagedCourts(updated);
        renderTable();
        showToast("Quadra removida da listagem administrativa.", "success");
      }
    });

    resetFormState();
    renderTable();
  };

  const initAdminSchedules = () => {
    const courtSelect = document.getElementById("admin-schedule-court");
    const dateInput = document.getElementById("admin-schedule-date");
    const tableNode = document.getElementById("admin-schedule-table");

    if (!courtSelect || !dateInput || !tableNode) {
      return;
    }

    courtSelect.innerHTML = getManagedCourts()
      .map(
        (court) =>
          `<option value="${court.id}">${court.nome} • ${court.modalidade}</option>`
      )
      .join("");

    dateInput.value = getTomorrowValue();

    const renderRows = () => {
      const courtId = Number(courtSelect.value);
      const schedule = getSchedule(courtId, dateInput.value);

      tableNode.innerHTML = schedule
        .map(
          (slot) => `
            <tr>
              <td>${slot.horario}</td>
              <td><span class="status-pill ${statusClass(slot.status)}">${slot.status}</span></td>
              <td>
                <div class="table-actions">
                  ${
                    slot.status === "Disponível"
                      ? `<button class="table-link" type="button" data-block-slot="${slot.horario}">Bloquear horário</button>`
                      : ""
                  }
                  ${
                    slot.status === "Bloqueado"
                      ? `<button class="table-link" type="button" data-release-slot="${slot.horario}">Liberar horário</button>`
                      : ""
                  }
                  ${
                    slot.status === "Reservado"
                      ? `<button class="table-link" type="button" data-view-slot="${slot.horario}" data-cliente="${slot.cliente}" data-telefone="${slot.telefone}" data-modalidade="${slot.modalidade}">Ver reserva</button>`
                      : ""
                  }
                </div>
              </td>
            </tr>
          `
        )
        .join("");
    };

    [courtSelect, dateInput].forEach((field) =>
      field.addEventListener("change", renderRows)
    );

    tableNode.addEventListener("click", (event) => {
      const courtId = Number(courtSelect.value);
      const date = dateInput.value;
      const blockButton = event.target.closest("[data-block-slot]");
      const releaseButton = event.target.closest("[data-release-slot]");
      const viewButton = event.target.closest("[data-view-slot]");

      if (blockButton) {
        setScheduleStatus(courtId, date, blockButton.dataset.blockSlot, "Bloqueado");
        renderRows();
        showToast("Horário bloqueado com sucesso.", "success");
      }

      if (releaseButton) {
        setScheduleStatus(courtId, date, releaseButton.dataset.releaseSlot, "Disponível");
        renderRows();
        showToast("Horário liberado novamente.", "success");
      }

      if (viewButton) {
        showModal({
          title: "Reserva encontrada",
          html: `
            <div class="info-grid">
              <div><span class="detail-label">Nome</span><p>${viewButton.dataset.cliente}</p></div>
              <div><span class="detail-label">Telefone</span><p>${viewButton.dataset.telefone}</p></div>
              <div><span class="detail-label">Modalidade</span><p>${viewButton.dataset.modalidade}</p></div>
              <div><span class="detail-label">Data</span><p>${formatDate(date)}</p></div>
              <div><span class="detail-label">Horário</span><p>${viewButton.dataset.viewSlot}</p></div>
            </div>
          `,
        });
      }
    });

    renderRows();
  };

  const initAdminReports = () => {
    const metricsNode = document.getElementById("report-metrics");
    const modalityChart = document.getElementById("report-modality-chart");
    const periodChart = document.getElementById("report-period-chart");
    const revenueChart = document.getElementById("report-revenue-chart");
    const tableNode = document.getElementById("report-table");
    const exportButton = document.getElementById("export-report");

    if (!metricsNode || !modalityChart || !periodChart || !revenueChart || !tableNode) {
      return;
    }

    const reservations = getReservations();
    const confirmed = reservations.filter((item) => item.status === "Confirmada");
    const cancelled = reservations.filter((item) => item.status === "Cancelada");
    const revenue = confirmed.reduce(
      (sum, reservation) => sum + Number(reservation.valor || 0),
      0
    );
    const ticket = confirmed.length ? revenue / confirmed.length : 0;
    const occupancy = Math.round((confirmed.length / 24) * 100);
    const byModality = getCountsBy(reservations, "modalidade");
    const byPeriod = reservations.reduce((accumulator, reservation) => {
      const hour = Number(reservation.horario.split(":")[0]);
      const bucket =
        hour < 12 ? "Manhã" : hour < 18 ? "Tarde" : "Noite";
      accumulator[bucket] = (accumulator[bucket] || 0) + 1;
      return accumulator;
    }, {});
    const byWeek = groupRevenueByWeek(confirmed);

    metricsNode.innerHTML = `
      <article class="app-card stat-card"><span>Total de reservas no mês</span><strong>${reservations.length}</strong></article>
      <article class="app-card stat-card"><span>Total de cancelamentos</span><strong>${cancelled.length}</strong></article>
      <article class="app-card stat-card"><span>Taxa de ocupação</span><strong>${occupancy}%</strong></article>
      <article class="app-card stat-card"><span>Faturamento estimado</span><strong>${formatCurrency(revenue)}</strong></article>
      <article class="app-card stat-card"><span>Ticket médio</span><strong>${formatCurrency(ticket)}</strong></article>
    `;

    const renderBarGroup = (target, source, currency = false) => {
      const maxValue = Math.max(...Object.values(source), 1);
      target.innerHTML = Object.entries(source)
        .map(([label, value]) => {
          const width = Math.max((value / maxValue) * 100, value ? 18 : 10);
          return `
            <div class="chart-row">
              <span>${label}</span>
              <div class="chart-bar"><div style="width:${width}%"></div></div>
              <strong>${currency ? formatCurrency(value) : value}</strong>
            </div>
          `;
        })
        .join("");
    };

    renderBarGroup(modalityChart, byModality);
    renderBarGroup(periodChart, byPeriod);
    renderBarGroup(revenueChart, byWeek, true);

    tableNode.innerHTML = reservations
      .map(
        (reservation) => `
          <tr>
            <td>${formatDate(reservation.data)}</td>
            <td>${reservation.quadra}</td>
            <td>${reservation.modalidade}</td>
            <td>1</td>
            <td>${formatCurrency(reservation.valor)}</td>
          </tr>
        `
      )
      .join("");

    if (exportButton) {
      exportButton.addEventListener("click", () => {
        showToast(
          "Relatório exportado com sucesso.",
          "success"
        );
      });
    }
  };

  const showPendingFlashToast = () => {
    const flash = consumeFlashToast();

    if (flash?.message) {
      showToast(flash.message, flash.type || "success");
    }
  };

  const initCurrentUserBadge = () => {
    const currentUser = getCurrentUser();
    const headerCta = document.querySelector("[data-header-cta]");

    document.querySelectorAll("[data-current-user]").forEach((target) => {
      if (currentUser?.name) {
        target.textContent = currentUser.name;
        target.hidden = false;
      } else {
        target.textContent = "";
        target.hidden = true;
      }
    });

    document.querySelectorAll("[data-auth-only]").forEach((node) => {
      node.hidden = !currentUser;
    });

    document.querySelectorAll("[data-guest-only]").forEach((node) => {
      node.hidden = Boolean(currentUser);
    });

    if (headerCta) {
      if (currentUser) {
        headerCta.textContent = "Minhas reservas";
        headerCta.href = pageUrl("minhas-reservas.html");
      } else {
        headerCta.textContent = "Entrar";
        headerCta.href = pageUrl("login.html");
      }
    }

    document.querySelectorAll("[data-logout]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        clearSession();
        setFlashToast("Sessão encerrada com sucesso.", "success");
        window.location.href = rootUrl("index.html");
      });
    });
  };

  seedStorage();
  ensureHeaderBehavior();
  ensureToastStack();
  ensureSharedModal();
  wireSharedModalEvents();
  initCurrentUserBadge();
  showPendingFlashToast();

  if (pageId === "login") initLoginPage();
  if (pageId === "cadastro") initCadastroPage();
  if (pageId === "cadastro-proprietario") initOwnerCadastroPage();
  if (pageId === "quadras") initQuadrasPage();
  if (pageId === "detalhes") initDetalhesPage();
  if (pageId === "agendamento") initAgendamentoPage();
  if (pageId === "reservas") initReservasPage();
  if (pageId === "admin-dashboard") initAdminDashboard();
  if (pageId === "admin-quadras") initAdminCourts();
  if (pageId === "admin-horarios") initAdminSchedules();
  if (pageId === "admin-relatorios") initAdminReports();

  window.AgQ = {
    assetUrl,
    closeSharedModal,
    formatCurrency,
    formatDate,
    getActiveCourts,
    getCourtById,
    getManagedCourts,
    getReservations,
    pageUrl,
    rootUrl,
    setFlashToast,
    showModal,
    showToast,
    statusClass,
    syncBodyLock,
  };
})();
