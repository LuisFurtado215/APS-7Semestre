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
    "08:30",
    "09:30",
    "10:30",
    "11:30",
    "14:00",
    "15:30",
    "16:30",
    "17:30",
    "18:00",
    "18:30",
    "19:30",
    "20:30",
    "21:00",
  ];

  const MODALITIES = ["Futebol", "Vôlei", "Basquete", "Beach Tennis", "Tênis"];

  const DEFAULT_SCHEDULE_TEMPLATE = {
    "08:30": { status: "Disponível" },
    "09:30": { status: "Disponível" },
    "10:30": { status: "Disponível" },
    "11:30": {
      status: "Reservado",
      cliente: "Carlos Mendes",
      telefone: "(16) 99999-0101",
      modalidade: "Beach Tennis",
    },
    "14:00": { status: "Disponível" },
    "15:30": { status: "Disponível" },
    "16:30": { status: "Bloqueado" },
    "17:30": { status: "Disponível" },
    "18:00": { status: "Disponível" },
    "18:30": { status: "Disponível" },
    "19:30": {
      status: "Reservado",
      cliente: "Equipe Arena RP",
      telefone: "(16) 99888-1212",
      modalidade: "Futebol",
    },
    "20:30": { status: "Bloqueado" },
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
      horario: "19:30",
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
      horario: "20:30",
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
    selectedBookingDuration: 1,
    adminEditingCourtId: null,
    lastFocusedElement: null,
    openCustomSelect: null,
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

  const formatDisplayDate = (value) => formatDate(value);

  const formatDurationLabel = (hours) => {
    const totalMinutes = Math.round(Number(hours || 0) * 60);
    const wholeHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    if (!totalMinutes) {
      return "Selecione";
    }

    if (!remainingMinutes) {
      return `${wholeHours}h`;
    }

    if (!wholeHours) {
      return `${remainingMinutes}min`;
    }

    return `${wholeHours}h${remainingMinutes.toString().padStart(2, "0")}`;
  };

  const timeToMinutes = (value) => {
    const [hours, minutes] = String(value || "00:00")
      .split(":")
      .map(Number);
    return hours * 60 + minutes;
  };

  const padDatePart = (value) => String(value).padStart(2, "0");

  const minutesToTime = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${padDatePart(hours)}:${padDatePart(minutes)}`;
  };

  const getBookingEndTime = (startTime, duration = 1) =>
    minutesToTime(timeToMinutes(startTime) + Number(duration || 1) * 60);

  const formatBookingWindow = (startTime, duration = 1) =>
    startTime
      ? `${startTime} às ${getBookingEndTime(startTime, duration)}`
      : "Selecione";

  const formatBookingEndOption = (startTime, duration = 1) =>
    startTime ? getBookingEndTime(startTime, duration) : formatDurationLabel(duration);

  const getDurationFromRange = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return 0;
    }

    const diff = timeToMinutes(endTime) - timeToMinutes(startTime);

    if (diff < 60 || diff % 5 !== 0) {
      return 0;
    }

    return diff / 60;
  };

  const getLatestBookingStartTime = (court) =>
    minutesToTime(Math.max(timeToMinutes(court?.horarioFechamento || "22:00") - 60, 0));

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${padDatePart(today.getMonth() + 1)}-${padDatePart(today.getDate())}`;
  };

  const parseDateString = (value) => {
    const [year, month, day] = String(value || "")
      .split("-")
      .map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  };

  const formatDateString = (date) => {
    if (!(date instanceof Date)) {
      return "";
    }

    return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
  };

  const isSameDay = (left, right) =>
    left instanceof Date &&
    right instanceof Date &&
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

  const isPastDateString = (value) =>
    Boolean(value) && String(value) < getTodayDateString();

  const enforceMinDate = (input, { defaultToToday = false, onInvalid } = {}) => {
    if (!(input instanceof HTMLInputElement) || input.type !== "date") {
      return;
    }

    const syncValue = () => {
      const today = getTodayDateString();
      input.min = today;

      if (!input.value && defaultToToday) {
        input.value = today;
        return;
      }

      if (isPastDateString(input.value)) {
        input.value = today;
        if (typeof onInvalid === "function") {
          onInvalid(today);
        }
      }
    };

    syncValue();
    input.addEventListener("change", syncValue);
    input.addEventListener("input", syncValue);
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

  const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

  const getRegisteredUsers = () => readJson(STORAGE_KEYS.users, []);

  const findRegisteredUser = (email, role = "cliente") =>
    getRegisteredUsers().find(
      (user) =>
        normalizeEmail(user.email) === normalizeEmail(email) &&
        String(user.role || "cliente").toLowerCase() === String(role || "cliente").toLowerCase()
    ) || null;

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
        <div class="shared-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="shared-modal-title" tabindex="-1">
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

    if (state.lastFocusedElement instanceof HTMLElement) {
      state.lastFocusedElement.focus();
    }

    state.lastFocusedElement = null;
  };

  const showModal = ({ title, text, html, actions = [] }) => {
    const modal = ensureSharedModal();
    const dialog = modal.querySelector(".shared-modal-dialog");
    const titleNode = modal.querySelector("#shared-modal-title");
    const contentNode = modal.querySelector("#shared-modal-content");
    const actionsNode = modal.querySelector("#shared-modal-actions");

    state.lastFocusedElement = document.activeElement;
    titleNode.textContent = title || "Aviso";
    contentNode.innerHTML = html || (text ? `<p>${text}</p>` : "");
    actionsNode.innerHTML = "";
    state.modalHandlers = actions.map((action) => action.onClick || null);

    actions.forEach((action, index) => {
      const button = document.createElement(action.href ? "a" : "button");
      button.className = `button ${action.variant === "secondary" ? "btn-secondary" : "btn-primary"} ${action.className || ""}`.trim();
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
    dialog?.focus();
  };

  const showFiltersHelpModal = () => {
    showModal({
      title: "Como funciona?",
      html: `
        <div class="help-modal-content">
          <p class="help-modal-intro">Busque a quadra ideal, confira os detalhes e entre para reservar seu horário.</p>
          <div class="help-modal-steps">
            <article>
              <span>1</span>
              <div>
                <h4>Use os filtros</h4>
                <p>Busque por nome, bairro, modalidade, data ou faixa de preço.</p>
              </div>
            </article>
            <article>
              <span>2</span>
              <div>
                <h4>Compare as opções</h4>
                <p>Veja estrutura, localização, preço e informações da quadra.</p>
              </div>
            </article>
            <article>
              <span>3</span>
              <div>
                <h4>Entre para reservar</h4>
                <p>Para confirmar um horário, você precisa entrar ou criar uma conta.</p>
              </div>
            </article>
          </div>
          <p class="help-modal-notice"><strong>Importante:</strong> visitantes podem visualizar as quadras, mas é necessário ter uma conta para reservar.</p>
        </div>
      `,
      actions: [
        {
          label: "ENTRAR",
          variant: "primary",
          href: pageUrl("login.html"),
        },
        {
          label: "CRIAR CONTA",
          variant: "secondary",
          href: pageUrl("cadastro.html"),
        },
      ],
    });
  };

  const showBookingAuthModal = (courtId, bookingSelection = null) => {
    const court = getCourtById(courtId);
    const hasSelection =
      bookingSelection?.date && bookingSelection?.time && court;

    showModal({
      title: "Entre para reservar",
      html: `
        <p>${hasSelection ? "Você selecionou uma data e um horário, mas precisa entrar ou criar uma conta para confirmar a reserva." : "Você pode visualizar os detalhes da quadra, mas precisa entrar ou criar uma conta para confirmar um horário."}</p>
        ${
          hasSelection
            ? `
              <div class="info-grid booking-selection-grid">
                <div><span class="detail-label">Quadra</span><p>${court.nome}</p></div>
                <div><span class="detail-label">Data</span><p>${formatDate(bookingSelection.date)}</p></div>
                <div><span class="detail-label">Horário</span><p>${formatBookingWindow(bookingSelection.time, bookingSelection.duration || 1)}</p></div>
              </div>
            `
            : ""
        }
      `,
      actions: [
        {
          label: "ENTRAR",
          variant: "primary",
          className: "pill-cta",
          href: pageUrl("login.html"),
        },
        {
          label: "CRIAR CONTA",
          variant: "secondary",
          href: pageUrl("cadastro.html"),
        },
        {
          label: "CONTINUAR VENDO DETALHES",
          variant: "secondary",
          className: "modal-keep-button",
          onClick: closeSharedModal,
        },
      ],
    });
  };

  const buildBookingAction = (court, label = "Agendar") => {
    const actionLabel = label || "Agendar";

    if (getCurrentUser()) {
      return `<a class="button btn-primary" href="${pageUrl(`pages/agendamento.html?id=${court.id}`)}">${actionLabel}</a>`;
    }

    return `<button class="button btn-primary" type="button" data-booking-gate="${court.id}">${actionLabel}</button>`;
  };

  const requireAuthenticatedUser = ({ redirectTo, role = "cliente", message } = {}) => {
    const currentUser = getCurrentUser();
    const expectedRole = String(role || "cliente").toLowerCase();
    const currentRole =
      currentUser?.role === "Proprietário"
        ? "proprietario"
        : currentUser?.role === "Cliente"
          ? "cliente"
          : String(currentUser?.role || "").toLowerCase();

    if (
      !currentUser ||
      currentRole !== expectedRole ||
      !findRegisteredUser(
        currentUser.email,
        expectedRole
      )
    ) {
      clearSession();
      setFlashToast(
        message || "Entre com uma conta cadastrada para acessar esta área.",
        "error"
      );
      window.location.href = redirectTo || pageUrl("login.html");
      return null;
    }

    return currentUser;
  };

  const getReservationCoveredSlots = (startTime, duration = 1, slots = TIME_SLOTS) => {
    if (!startTime) {
      return [];
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + Number(duration || 1) * 60;

    return slots.filter((slot) => {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + 60;

      return startMinutes < slotEnd && endMinutes > slotStart;
    });
  };

  const getAvailableDurationOptions = (schedule, startTime, maxDuration = 4) => {
    const startIndex = schedule.findIndex((slot) => slot.horario === startTime);

    if (startIndex === -1 || schedule[startIndex].status !== "Disponível") {
      return [];
    }

    const options = [1];

    for (let duration = 2; duration <= maxDuration; duration += 1) {
      const previous = schedule[startIndex + duration - 2];
      const next = schedule[startIndex + duration - 1];

      if (
        !previous ||
        !next ||
        next.status !== "Disponível" ||
        timeToMinutes(next.horario) - timeToMinutes(previous.horario) !== 60
      ) {
        break;
      }

      options.push(duration);
    }

    return options;
  };

  const getBlockedIntervals = (schedule) =>
    schedule
      .filter((slot) => slot.status !== "Disponível")
      .map((slot) => ({
        start: timeToMinutes(slot.horario),
        end: timeToMinutes(slot.horario) + 60,
      }));

  const isRangeAvailableForCourt = (court, schedule, startTime, duration = 1) => {
    if (!startTime) {
      return false;
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + Number(duration || 1) * 60;
    const openMinutes = timeToMinutes(court?.horarioAbertura || "08:00");
    const closeMinutes = timeToMinutes(court?.horarioFechamento || "22:00");

    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      return false;
    }

    return !getBlockedIntervals(schedule).some(
      (interval) => startMinutes < interval.end && endMinutes > interval.start
    );
  };

  const getAllowedDurationsForStartTime = (court, schedule, startTime, maxDuration = 4) => {
    if (!startTime) {
      return [];
    }

    const options = [];

    for (let duration = 1; duration <= maxDuration; duration += 1) {
      if (!isRangeAvailableForCourt(court, schedule, startTime, duration)) {
        break;
      }

      options.push(duration);
    }

    return options;
  };

  const getSelectableTimeOptions = (court, schedule, duration = 1) => {
    const options = [];
    const start = timeToMinutes(court?.horarioAbertura || "08:00");
    const end = timeToMinutes(getLatestBookingStartTime(court));

    for (let minutes = start; minutes <= end; minutes += 5) {
      const time = minutesToTime(minutes);
      options.push({
        value: time,
        disabled: !isRangeAvailableForCourt(court, schedule, time, duration),
      });
    }

    return options;
  };

  const getEndTimeOptions = (court, schedule, startTime, maxDuration = 4) => {
    if (!court || !startTime) {
      return [];
    }

    const closeMinutes = timeToMinutes(court.horarioFechamento || "22:00");
    const startMinutes = timeToMinutes(startTime);
    const maxByClose = Math.floor((closeMinutes - startMinutes) / 60);
    const limit = Math.max(0, Math.min(maxDuration, maxByClose));
    const options = [];

    for (let duration = 1; duration <= limit; duration += 1) {
      options.push({
        value: getBookingEndTime(startTime, duration),
        label: getBookingEndTime(startTime, duration),
        disabled: !isRangeAvailableForCourt(court, schedule, startTime, duration),
      });
    }

    return options;
  };

  const createCustomTimePicker = (root, { placeholder = "Selecione um horário", onChange } = {}) => {
    if (!(root instanceof HTMLElement)) {
      return {
        setState() {},
      };
    }

    const minuteOptions = Array.from({ length: 12 }, (_, index) =>
      padDatePart(index * 5)
    );

    const pickerState = {
      values: [],
      value: "",
      disabled: true,
      isOpen: false,
      activeHour: null,
      hourExplicitlyChosen: false,
    };

    root.innerHTML = `
      <button class="time-picker-trigger" type="button" aria-expanded="false">
        <span class="time-picker-value">${placeholder}</span>
      </button>
      <div class="time-picker-panel" hidden>
        <div class="time-picker-columns">
          <div class="time-picker-column">
            <span class="time-picker-label">Hora</span>
            <div class="time-picker-grid" data-time-hours></div>
          </div>
          <div class="time-picker-column">
            <span class="time-picker-label">Minutos</span>
            <div class="time-picker-grid time-picker-grid-minutes" data-time-minutes></div>
          </div>
        </div>
      </div>
    `;

    const trigger = root.querySelector(".time-picker-trigger");
    const valueNode = root.querySelector(".time-picker-value");
    const panel = root.querySelector(".time-picker-panel");
    const hoursNode = root.querySelector("[data-time-hours]");
    const minutesNode = root.querySelector("[data-time-minutes]");

    const getHourOptions = () =>
      Array.from(
        new Set(
          pickerState.values.map((value) => String(value).split(":")[0]).filter(Boolean)
        )
      );

    const isTimeEnabled = (time) => pickerState.values.includes(time);

    const isHourEnabled = (hour) =>
      pickerState.values.some((value) => String(value).startsWith(`${hour}:`));

    const syncActiveHour = () => {
      if (pickerState.value) {
        pickerState.activeHour = pickerState.value.split(":")[0];
        pickerState.hourExplicitlyChosen = true;
        return;
      }

      if (pickerState.activeHour && isHourEnabled(pickerState.activeHour)) {
        return;
      }

      pickerState.activeHour = getHourOptions().find((hour) => isHourEnabled(hour)) || null;
      if (!pickerState.activeHour) {
        pickerState.hourExplicitlyChosen = false;
      }
    };

    const render = () => {
      const displayValue =
        pickerState.value ||
        (pickerState.hourExplicitlyChosen && pickerState.activeHour
          ? `${pickerState.activeHour}:--`
          : placeholder);
      valueNode.textContent = displayValue;
      trigger.disabled = pickerState.disabled;
      trigger.setAttribute("aria-expanded", String(pickerState.isOpen && !pickerState.disabled));
      root.classList.toggle("is-disabled", pickerState.disabled);
      root.classList.toggle("is-open", pickerState.isOpen && !pickerState.disabled);
      panel.hidden = pickerState.disabled || !pickerState.isOpen;

      syncActiveHour();

      const hourOptions = getHourOptions();
      hoursNode.innerHTML = hourOptions
        .map((hour) => {
          const enabled = isHourEnabled(hour);
          const selected = pickerState.activeHour === hour;

          return `
            <button
              class="time-picker-chip ${selected ? "is-selected" : ""}"
              type="button"
              data-time-hour="${hour}"
              ${enabled ? "" : "disabled"}
            >
              ${hour}
            </button>
          `;
        })
        .join("");

      const activeHour = pickerState.activeHour;
      minutesNode.innerHTML = minuteOptions
        .map((minute) => {
          const time = activeHour ? `${activeHour}:${minute}` : "";
          const enabled =
            Boolean(pickerState.hourExplicitlyChosen && activeHour) &&
            isTimeEnabled(time);
          const selected = pickerState.value === time;

          return `
            <button
              class="time-picker-chip ${selected ? "is-selected" : ""}"
              type="button"
              data-time-minute="${minute}"
              ${enabled ? "" : "disabled"}
            >
              ${minute}
            </button>
          `;
        })
        .join("");
    };

    trigger?.addEventListener("click", () => {
      if (pickerState.disabled) {
        return;
      }

      pickerState.isOpen = !pickerState.isOpen;
      render();
    });

    root.addEventListener("click", (event) => {
      const hourButton = event.target.closest("[data-time-hour]");
      const minuteButton = event.target.closest("[data-time-minute]");

      if (hourButton) {
        event.stopPropagation();
        const nextHour = hourButton.dataset.timeHour || null;
        pickerState.activeHour = nextHour;
        pickerState.hourExplicitlyChosen = Boolean(pickerState.activeHour);
        pickerState.value = "";
        pickerState.isOpen = true;
        render();
      }

      if (minuteButton && pickerState.activeHour) {
        event.stopPropagation();
        const nextValue = `${pickerState.activeHour}:${minuteButton.dataset.timeMinute}`;
        pickerState.value = nextValue;
        pickerState.isOpen = false;
        pickerState.hourExplicitlyChosen = false;
        render();

        if (typeof onChange === "function") {
          onChange(nextValue);
        }
      }
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) {
        pickerState.isOpen = false;
        render();
      }
    });

    return {
      setState({ values = [], value = "", disabled = true } = {}) {
        pickerState.values = Array.isArray(values) ? values : [];
        pickerState.value = value || "";
        pickerState.disabled = disabled;
        pickerState.hourExplicitlyChosen = Boolean(value);

        if (disabled) {
          pickerState.isOpen = false;
        }

        render();
      },
    };
  };

  const createOptionPicker = (root, { placeholder = "Selecione", onChange } = {}) => {
    if (!(root instanceof HTMLElement)) {
      return {
        setState() {},
      };
    }

    const pickerState = {
      options: [],
      value: "",
      disabled: true,
      isOpen: false,
    };

    root.innerHTML = `
      <button class="time-picker-trigger" type="button" aria-expanded="false">
        <span class="time-picker-value">${placeholder}</span>
      </button>
      <div class="time-picker-panel time-picker-panel-single" hidden>
        <div class="time-picker-column">
          <span class="time-picker-label">Horário final</span>
          <div class="time-picker-grid time-picker-grid-single" data-option-grid></div>
        </div>
      </div>
    `;

    const trigger = root.querySelector(".time-picker-trigger");
    const valueNode = root.querySelector(".time-picker-value");
    const panel = root.querySelector(".time-picker-panel");
    const gridNode = root.querySelector("[data-option-grid]");

    const render = () => {
      valueNode.textContent = pickerState.value || placeholder;
      trigger.disabled = pickerState.disabled;
      trigger.setAttribute("aria-expanded", String(pickerState.isOpen && !pickerState.disabled));
      root.classList.toggle("is-disabled", pickerState.disabled);
      root.classList.toggle("is-open", pickerState.isOpen && !pickerState.disabled);
      panel.hidden = pickerState.disabled || !pickerState.isOpen;

      gridNode.innerHTML = pickerState.options.length
        ? pickerState.options
            .map(
              (option) => `
                <button
                  class="time-picker-chip ${pickerState.value === option.value ? "is-selected" : ""}"
                  type="button"
                  data-picker-option="${option.value}"
                  ${option.disabled ? "disabled" : ""}
                >
                  ${option.label}
                </button>
              `
            )
            .join("")
        : `<div class="time-picker-placeholder">Escolha o horário inicial primeiro</div>`;
    };

    trigger?.addEventListener("click", () => {
      if (pickerState.disabled) {
        return;
      }

      pickerState.isOpen = !pickerState.isOpen;
      render();
    });

    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-picker-option]");

      if (!button) {
        return;
      }

      pickerState.value = button.dataset.pickerOption || "";
      pickerState.isOpen = false;
      render();

      if (typeof onChange === "function") {
        onChange(pickerState.value);
      }
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) {
        pickerState.isOpen = false;
        render();
      }
    });

    return {
      setState({ options = [], value = "", disabled = true } = {}) {
        pickerState.options = Array.isArray(options) ? options : [];
        pickerState.value = value || "";
        pickerState.disabled = disabled;

        if (disabled) {
          pickerState.isOpen = false;
        }

        render();
      },
    };
  };

  const createCustomSelect = (select) => {
    if (!(select instanceof HTMLSelectElement)) {
      return null;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "custom-select-shell";
    wrapper.innerHTML = `
      <button
        class="custom-select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span class="custom-select-value"></span>
      </button>
      <div class="custom-select-panel" role="listbox" hidden></div>
    `;

    select.classList.add("is-customized");
    select.setAttribute("aria-hidden", "true");
    select.tabIndex = -1;
    select.insertAdjacentElement("afterend", wrapper);

    const trigger = wrapper.querySelector(".custom-select-trigger");
    const valueNode = wrapper.querySelector(".custom-select-value");
    const panel = wrapper.querySelector(".custom-select-panel");

    const close = () => {
      wrapper.classList.remove("is-open");
      trigger?.setAttribute("aria-expanded", "false");
      panel.hidden = true;

      if (state.openCustomSelect === close) {
        state.openCustomSelect = null;
      }
    };

    const open = () => {
      if (select.disabled) {
        return;
      }

      if (typeof state.openCustomSelect === "function" && state.openCustomSelect !== close) {
        state.openCustomSelect();
      }

      wrapper.classList.add("is-open");
      trigger?.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      state.openCustomSelect = close;
    };

    const render = () => {
      const options = Array.from(select.options);
      const selectedOption =
        options.find((option) => option.value === select.value) || options[0];

      valueNode.textContent = selectedOption?.textContent?.trim() || "Selecione";
      trigger.disabled = select.disabled;
      wrapper.classList.toggle("is-disabled", select.disabled);

      if (select.disabled) {
        close();
      }

      panel.innerHTML = options
        .map((option) => {
          const selected = option.value === select.value;

          return `
            <button
              class="custom-select-option ${selected ? "is-selected" : ""}"
              type="button"
              role="option"
              data-select-value="${option.value}"
              aria-selected="${String(selected)}"
            >
              ${option.textContent?.trim() || ""}
            </button>
          `;
        })
        .join("");
    };

    trigger?.addEventListener("click", () => {
      if (wrapper.classList.contains("is-open")) {
        close();
      } else {
        open();
      }
    });

    wrapper.addEventListener("click", (event) => {
      const optionButton = event.target.closest("[data-select-value]");

      if (!optionButton) {
        return;
      }

      if (select.disabled) {
        close();
        return;
      }

      const nextValue = optionButton.dataset.selectValue || "";

      if (select.value !== nextValue) {
        select.value = nextValue;
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }

      render();
      close();
    });

    select.addEventListener("change", render);

    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) {
        close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && wrapper.classList.contains("is-open")) {
        close();
      }
    });

    render();

    return {
      render,
      close,
    };
  };

  const createCustomDatePicker = (
    root,
    { placeholder = "Selecione uma data", onChange } = {}
  ) => {
    if (!(root instanceof HTMLElement)) {
      return {
        setState() {},
      };
    }

    const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
    const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    });

    const pickerState = {
      value: "",
      minDate: getTodayDateString(),
      viewDate: parseDateString(getTodayDateString()) || new Date(),
      disabled: false,
      isOpen: false,
    };

    root.innerHTML = `
      <button
        class="date-picker-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        <span class="date-picker-value">${placeholder}</span>
      </button>
      <div class="date-picker-panel" role="dialog" aria-label="Selecionar data" hidden>
        <div class="date-picker-header">
          <button type="button" class="date-picker-nav" data-date-prev aria-label="Mês anterior">
            &#8249;
          </button>
          <strong class="date-picker-title"></strong>
          <button type="button" class="date-picker-nav" data-date-next aria-label="Próximo mês">
            &#8250;
          </button>
        </div>
        <div class="date-picker-weekdays">
          ${weekDays.map((day) => `<span>${day}</span>`).join("")}
        </div>
        <div class="date-picker-days" data-date-days></div>
      </div>
    `;

    const trigger = root.querySelector(".date-picker-trigger");
    const valueNode = root.querySelector(".date-picker-value");
    const panel = root.querySelector(".date-picker-panel");
    const titleNode = root.querySelector(".date-picker-title");
    const daysNode = root.querySelector("[data-date-days]");
    const prevButton = root.querySelector("[data-date-prev]");
    const nextButton = root.querySelector("[data-date-next]");

    const getMinDate = () => parseDateString(pickerState.minDate) || new Date();

    const updatePanelDirection = () => {
      if (!pickerState.isOpen || pickerState.disabled || !panel) {
        root.classList.remove("opens-up");
        return;
      }

      root.classList.remove("opens-up");
      const panelRect = panel.getBoundingClientRect();
      const triggerRect = trigger?.getBoundingClientRect();

      if (!triggerRect) {
        return;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const shouldOpenUp =
        panelRect.height > spaceBelow && spaceAbove > spaceBelow;

      root.classList.toggle("opens-up", shouldOpenUp);
    };

    const syncViewDate = () => {
      const selected = parseDateString(pickerState.value);
      pickerState.viewDate = selected || getMinDate();
    };

    const canGoToPreviousMonth = () => {
      const minDate = getMinDate();
      return (
        pickerState.viewDate.getFullYear() > minDate.getFullYear() ||
        (pickerState.viewDate.getFullYear() === minDate.getFullYear() &&
          pickerState.viewDate.getMonth() > minDate.getMonth())
      );
    };

    const render = () => {
      const selectedDate = parseDateString(pickerState.value);
      const minDate = getMinDate();
      valueNode.textContent = pickerState.value
        ? formatDisplayDate(pickerState.value)
        : placeholder;
      trigger.disabled = pickerState.disabled;
      trigger.setAttribute(
        "aria-expanded",
        String(pickerState.isOpen && !pickerState.disabled)
      );
      root.classList.toggle("is-open", pickerState.isOpen && !pickerState.disabled);
      root.classList.toggle("is-disabled", pickerState.disabled);
      panel.hidden = pickerState.disabled || !pickerState.isOpen;

      titleNode.textContent = monthFormatter.format(pickerState.viewDate);
      prevButton.disabled = !canGoToPreviousMonth();

      const year = pickerState.viewDate.getFullYear();
      const month = pickerState.viewDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const leadingDays = firstDay.getDay();
      const totalDays = lastDay.getDate();
      const cells = [];

      for (let index = 0; index < leadingDays; index += 1) {
        cells.push(`<span class="date-picker-day is-empty" aria-hidden="true"></span>`);
      }

      for (let day = 1; day <= totalDays; day += 1) {
        const currentDate = new Date(year, month, day);
        const currentValue = formatDateString(currentDate);
        const isDisabled = currentValue < pickerState.minDate;
        const isToday = isSameDay(currentDate, minDate);
        const isSelected = selectedDate && isSameDay(currentDate, selectedDate);

        cells.push(`
          <button
            type="button"
            class="date-picker-day ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}"
            data-date-value="${currentValue}"
            ${isDisabled ? "disabled" : ""}
          >
            ${day}
          </button>
        `);
      }

      daysNode.innerHTML = cells.join("");
      updatePanelDirection();
    };

    trigger?.addEventListener("click", () => {
      if (pickerState.disabled) {
        return;
      }

      pickerState.isOpen = !pickerState.isOpen;
      render();
    });

    root.addEventListener("click", (event) => {
      const prev = event.target.closest("[data-date-prev]");
      const next = event.target.closest("[data-date-next]");
      const dayButton = event.target.closest("[data-date-value]");

      if (prev) {
        event.stopPropagation();
        if (canGoToPreviousMonth()) {
          pickerState.viewDate = new Date(
            pickerState.viewDate.getFullYear(),
            pickerState.viewDate.getMonth() - 1,
            1
          );
          render();
        }
      }

      if (next) {
        event.stopPropagation();
        pickerState.viewDate = new Date(
          pickerState.viewDate.getFullYear(),
          pickerState.viewDate.getMonth() + 1,
          1
        );
        render();
      }

      if (dayButton) {
        event.stopPropagation();
        pickerState.value = dayButton.dataset.dateValue || "";
        pickerState.isOpen = false;
        syncViewDate();
        render();

        if (typeof onChange === "function") {
          onChange(pickerState.value);
        }
      }
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) {
        pickerState.isOpen = false;
        render();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && pickerState.isOpen) {
        pickerState.isOpen = false;
        render();
      }
    });

    window.addEventListener("resize", updatePanelDirection);

    return {
      setState({ value = "", minDate = getTodayDateString(), disabled = false } = {}) {
        pickerState.value = value || "";
        pickerState.minDate = minDate;
        pickerState.disabled = disabled;
        syncViewDate();

        if (disabled) {
          pickerState.isOpen = false;
        }

        render();
      },
    };
  };

  const getDetailScheduleForDate = (courtId, date) => {
    const today = getTodayDateString();
    const baseSchedule = getSchedule(courtId, date);

    if (date === today) {
      return baseSchedule;
    }

    const [selectedYear, selectedMonth, selectedDay] = date.split("-").map(Number);
    const [todayYear, todayMonth, todayDay] = today.split("-").map(Number);
    const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const currentDate = new Date(todayYear, todayMonth - 1, todayDay);
    const offset = Math.abs(
      Math.round((selectedDate.getTime() - currentDate.getTime()) / 86400000)
    );

    return baseSchedule.map((slot, index) => {
      if (slot.status !== "Disponível") {
        return slot;
      }

      if ((index + offset) % 5 === 0) {
        return { ...slot, status: "Reservado" };
      }

      if ((index + offset) % 7 === 0) {
        return { ...slot, status: "Bloqueado" };
      }

      return slot;
    });
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
      const coveredSlots = getReservationCoveredSlots(
        reservation.horario,
        reservation.duracao || 1
      );

      coveredSlots.forEach((time) => {
        const slot = schedule.find((item) => item.horario === time);

        if (slot) {
          slot.status = "Reservado";
          slot.cliente = reservation.cliente;
          slot.telefone = reservation.telefone || "(16) 99999-0000";
          slot.modalidade = reservation.modalidade;
        }
      });
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

  const getUniqueTags = (items = []) => {
    const seen = new Set();

    return (Array.isArray(items) ? items : []).reduce((tags, item) => {
      const label = String(item || "").trim();
      const key = slugifyText(label);

      if (!label || seen.has(key)) {
        return tags;
      }

      seen.add(key);
      tags.push(label);
      return tags;
    }, []);
  };

  const buildFacilityBadges = (items = []) =>
    getUniqueTags(items)
      .map((item) => `<span class="tag-pill">${item}</span>`)
      .join("");

  const getDetailFacilities = (court) => {
    const extrasByModality = {
      Futebol: ["Bebedouro", "Estacionamento", "Vestiário", "Churrasqueira"],
      Basquete: ["Iluminação", "Bebedouro", "Arquibancada", "Vestiário"],
      Vôlei: ["Iluminação", "Bebedouro", "Estacionamento", "Vestiário"],
      "Beach Tennis": ["Iluminação", "Bebedouro", "Estacionamento", "Vestiário"],
      Tênis: ["Iluminação", "Bebedouro", "Estacionamento", "Vestiário"],
      default: ["Iluminação", "Bebedouro", "Estacionamento"],
    };

    return getUniqueTags([
      ...(court?.estrutura || []),
      ...(extrasByModality[court?.modalidade] || extrasByModality.default),
    ]);
  };

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
      const isAdmin = typeInput.value === "proprietario";
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

        const isAdmin = typeInput.value === "proprietario";
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
      const registeredUser = findRegisteredUser(email, role);

      if (!email || !senha) {
        message.textContent = "Preencha e-mail e senha para continuar.";
        message.className = "form-message is-error";
        return;
      }

      if (!registeredUser) {
        message.textContent = "Conta não encontrada. Faça seu cadastro antes de entrar.";
        message.className = "form-message is-error";
        return;
      }

      if (registeredUser.senha && registeredUser.senha !== senha) {
        message.textContent = "Senha incorreta para esta conta.";
        message.className = "form-message is-error";
        return;
      }

      setCurrentUser({
        name: registeredUser.nome || "Usuário",
        email: registeredUser.email,
        role: role === "proprietario" ? "Proprietário" : "Cliente",
      });

      writeJson(STORAGE_KEYS.session, {
        role,
        email,
        updatedAt: Date.now(),
      });

      setFlashToast(
        role === "proprietario"
          ? "Acesso administrativo liberado com sucesso."
          : "Login realizado com sucesso!",
        "success"
      );

      window.location.href =
        role === "proprietario"
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
        senha,
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
        role: "proprietario",
        senha,
      };

      users.push(owner);
      writeJson(STORAGE_KEYS.users, users);
      setCurrentUser({
        name: owner.nome,
        email: owner.email,
        role: "Proprietário",
      });
      writeJson(STORAGE_KEYS.session, {
        role: "proprietario",
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
          </div>
          <span class="price-badge">${formatCurrency(court.preco)}/hora</span>
        </div>
        <p class="court-meta">${court.modalidade} • ${court.bairro}</p>
        <div class="tag-row tag-row-court">${buildFacilityBadges(court.estrutura.slice(0, 4))}</div>
        <div class="inline-actions court-card-actions">
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
    const helpButton = document.getElementById("helpFiltersBtn");
    const howItWorksLink = document.getElementById("navHowItWorks");
    const cityNotice = document.getElementById("city-notice");
    const today = getTodayDateString();
    let selectedFilterDate = today;

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

    const filterDatePicker = createCustomDatePicker(dateInput, {
      onChange: (nextValue) => {
        selectedFilterDate = nextValue || today;
        applyFilters();
      },
    });
    const modalityCustomSelect = createCustomSelect(modalitySelect);
    const neighborhoodCustomSelect = createCustomSelect(neighborhoodSelect);
    const priceCustomSelect = createCustomSelect(priceSelect);

    const applyFilters = () => {
      const term = slugifyText(searchInput?.value || "");
      const modalidade = modalitySelect?.value || "Todos";
      const bairro = neighborhoodSelect?.value || "Todos";
      const data = selectedFilterDate || "";
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
        modalityCustomSelect?.render();
      }

      if (neighborhoodSelect) {
        neighborhoodSelect.value = "Todos";
        neighborhoodCustomSelect?.render();
      }

      if (priceSelect) {
        priceSelect.value = "Todos";
        priceCustomSelect?.render();
      }

      selectedFilterDate = today;
      filterDatePicker.setState({ value: selectedFilterDate, minDate: today });

      applyFilters();
    };

    [searchInput, modalitySelect, neighborhoodSelect, priceSelect].forEach(
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

    if (helpButton) {
      helpButton.addEventListener("click", showFiltersHelpModal);
    }

    if (howItWorksLink && helpButton) {
      howItWorksLink.addEventListener("click", (event) => {
        event.preventDefault();

        helpButton.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        window.setTimeout(() => {
          helpButton.classList.remove("help-bounce");
          void helpButton.offsetWidth;
          helpButton.classList.add("help-bounce");
          helpButton.focus({ preventScroll: true });

          window.setTimeout(() => {
            helpButton.classList.remove("help-bounce");
          }, 1200);
        }, 450);
      });
    }

    listNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-booking-gate]");

      if (!trigger) {
        return;
      }

      event.preventDefault();
      showBookingAuthModal(trigger.dataset.bookingGate);
    });

    filterDatePicker.setState({ value: selectedFilterDate, minDate: today });
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

    const detailFacilities = getDetailFacilities(court);
    const today = getTodayDateString();
    let selectedDetailDate = today;
    state.selectedBookingTime = null;
    state.selectedBookingDuration = 1;

    container.innerHTML = `
      <div class="detail-hero">
        <div class="detail-media-panel app-card">
          <img class="detail-court-image" src="${assetUrl(court.imagem)}" alt="${court.nome}" />
          <div class="detail-quick-facts" aria-label="Resumo rápido da quadra">
            <span>
              <strong>Modalidade</strong>
              ${court.modalidade}
            </span>
            <span>
              <strong>Bairro</strong>
              ${court.bairro}
            </span>
            <span>
              <strong>Preço</strong>
              ${formatCurrency(court.preco)}/h
            </span>
          </div>
        </div>
        <div class="detail-summary app-card">
          <span class="detail-location">RIBEIRÃO PRETO/SP</span>
          <div class="detail-title-block">
            <h1>${court.nome}</h1>
            <p class="detail-subtitle">${court.modalidade} • ${court.bairro}</p>
          </div>
          <div class="rating-box">
            <strong>${court.avaliacao.toFixed(1)} estrelas</strong>
            <span>Baseado em 123 avaliações</span>
          </div>
          <div class="detail-grid">
            <article class="detail-info-card">
              <span class="detail-label">Endereço</span>
              <p>${court.endereco}</p>
            </article>
            <article class="detail-info-card">
              <span class="detail-label">Funcionamento</span>
              <p>${court.horarioAbertura} às ${court.horarioFechamento}</p>
            </article>
            <article class="detail-info-card detail-price-card">
              <span class="detail-label">Preço</span>
              <p>${formatCurrency(court.preco)} por hora</p>
            </article>
          </div>
          <section class="detail-section">
            <h3>Descrição</h3>
            <p class="detail-description">${court.descricao}</p>
          </section>
          <section class="detail-section facility-section">
            <h3>Estrutura disponível</h3>
            <div class="tag-row detail-tag-row">${buildFacilityBadges(detailFacilities)}</div>
          </section>
          <section class="rules-card detail-section">
            <h3>Regras da quadra</h3>
            <ul class="info-list">
              <li>Tolerância de atraso de 10 minutos.</li>
              <li>Cancelamento permitido com até 2 horas de antecedência.</li>
              <li>Uso obrigatório de calçado adequado.</li>
            </ul>
          </section>
          <section class="detail-section schedule-preview">
            <div class="detail-section-heading">
              <h3>Horários disponíveis</h3>
              <p>Escolha uma data para visualizar os horários disponíveis.</p>
            </div>
            <div class="detail-booking-grid">
              <label class="detail-date-field detail-booking-full">
                <span>Data da reserva</span>
                <div id="detail-booking-date" class="date-picker-shell"></div>
              </label>
              <label class="detail-date-field">
                <span>Horário</span>
                <div id="detail-booking-time" class="time-picker-shell"></div>
              </label>
              <label class="detail-date-field">
                <span>Até</span>
                <div id="detail-booking-end" class="time-picker-shell"></div>
              </label>
            </div>
            <p class="detail-inline-message" id="detail-date-message" hidden></p>
            <div class="detail-time-feedback" id="detail-time-feedback">
              Selecione uma data para ver os horários disponíveis.
            </div>
            <p class="detail-inline-message" id="detail-booking-message" hidden></p>
          </section>
          <div class="inline-actions detail-actions">
            <button class="button btn-primary is-disabled" type="button" id="detail-booking-action" data-detail-booking="${court.id}" disabled>
              Agendar horário
            </button>
            <a class="button btn-secondary" href="${pageUrl("pages/quadras.html")}">Ver outras quadras</a>
          </div>
        </div>
      </div>
    `;

    const dateInput = document.getElementById("detail-booking-date");
    const timePickerRoot = document.getElementById("detail-booking-time");
    const timeFeedback = document.getElementById("detail-time-feedback");
    const bookingButton = document.getElementById("detail-booking-action");
    const bookingMessage = document.getElementById("detail-booking-message");
    const dateMessage = document.getElementById("detail-date-message");
    const endPickerRoot = document.getElementById("detail-booking-end");
    const detailDatePicker = createCustomDatePicker(dateInput, {
      onChange: (nextValue) => {
        selectedDetailDate = nextValue || today;
        state.selectedBookingTime = null;
        state.selectedBookingDuration = 1;
        setInlineMessage(dateMessage);
        setInlineMessage(bookingMessage);
        renderDetailSchedule();
      },
    });
    const detailTimePicker = createCustomTimePicker(timePickerRoot, {
      onChange: (nextValue) => {
        const schedule = selectedDetailDate
          ? getDetailScheduleForDate(court.id, selectedDetailDate)
          : [];

        if (
          nextValue &&
          !isRangeAvailableForCourt(court, schedule, nextValue, 1)
        ) {
          state.selectedBookingTime = null;
          setInlineMessage(
            bookingMessage,
            "Esse horário não está disponível para reserva."
          );
          renderDetailSchedule();
          return;
        }

        state.selectedBookingTime = nextValue;
        state.selectedBookingDuration = 1;
        setInlineMessage(bookingMessage);
        renderDetailSchedule();
      },
    });
    const detailEndPicker = createOptionPicker(endPickerRoot, {
      placeholder: "Selecione o final",
      onChange: (nextValue) => {
        const duration = getDurationFromRange(state.selectedBookingTime, nextValue);

        if (duration < 1) {
          setInlineMessage(
            bookingMessage,
            "Escolha um horário final válido."
          );
          renderDetailSchedule();
          return;
        }

        state.selectedBookingDuration = duration;
        setInlineMessage(bookingMessage);
        renderDetailSchedule();
      },
    });

    const setInlineMessage = (node, message = "") => {
      if (!node) {
        return;
      }

      node.textContent = message;
      node.hidden = !message;
    };

    const syncBookingButton = () => {
      const isReady = Boolean(
        selectedDetailDate && state.selectedBookingTime && state.selectedBookingDuration >= 1
      );

      if (!bookingButton) {
        return;
      }

      bookingButton.disabled = !isReady;
      bookingButton.classList.toggle("is-disabled", !isReady);
    };

    const renderDetailSchedule = () => {
      if (!timePickerRoot || !timeFeedback || !dateInput) {
        return;
      }

      const selectedDate = selectedDetailDate;
      const schedule = selectedDate ? getDetailScheduleForDate(court.id, selectedDate) : [];

      if (!selectedDate) {
      detailTimePicker.setState({ disabled: true });
      detailEndPicker.setState({ disabled: true });
      detailDatePicker.setState({ value: "", minDate: today });
      timeFeedback.hidden = false;
      timeFeedback.textContent = "Selecione uma data para ver os horários disponíveis.";
      state.selectedBookingTime = null;
        state.selectedBookingDuration = 1;
        syncBookingButton();
        return;
      }

      detailDatePicker.setState({ value: selectedDate, minDate: today });

      if (
        state.selectedBookingTime &&
        !isRangeAvailableForCourt(
          court,
          schedule,
          state.selectedBookingTime,
          state.selectedBookingDuration
        )
      ) {
        state.selectedBookingTime = null;
      }

      const hasAnyAvailability = getAllowedDurationsForStartTime(
        court,
        schedule,
        court.horarioAbertura
      ).length > 0 || schedule.some((slot) => slot.status === "Disponível");

      timeFeedback.hidden = hasAnyAvailability;
      timeFeedback.textContent = hasAnyAvailability
        ? ""
        : "Nenhum horário disponível para esta data. Escolha outra data.";

      const durationOptions = getAllowedDurationsForStartTime(
        court,
        schedule,
        state.selectedBookingTime
      );

      if (!durationOptions.includes(state.selectedBookingDuration)) {
        state.selectedBookingDuration = durationOptions[0] || 1;
      }

      const timeOptions = getSelectableTimeOptions(court, schedule, 1);
      detailTimePicker.setState({
        values: timeOptions.filter((option) => !option.disabled).map((option) => option.value),
        value: state.selectedBookingTime || "",
        disabled: !timeOptions.some((option) => !option.disabled),
      });
      const endOptions = getEndTimeOptions(court, schedule, state.selectedBookingTime);
      detailEndPicker.setState({
        options: endOptions,
        value: state.selectedBookingTime
          ? getBookingEndTime(state.selectedBookingTime, state.selectedBookingDuration)
          : "",
        disabled: !state.selectedBookingTime || !endOptions.length,
      });

      syncBookingButton();
    };

    renderDetailSchedule();
    syncBookingButton();

    container.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-detail-booking]");

      if (!trigger) {
        return;
      }

      event.preventDefault();

      if (!selectedDetailDate || !state.selectedBookingTime || state.selectedBookingDuration < 1) {
        setInlineMessage(
          bookingMessage,
          "Escolha uma data, um horário e até quando a reserva vai."
        );
        syncBookingButton();
        return;
      }

      if (
        !isRangeAvailableForCourt(
          court,
          getDetailScheduleForDate(court.id, selectedDetailDate),
          state.selectedBookingTime,
          state.selectedBookingDuration
        )
      ) {
        setInlineMessage(
          bookingMessage,
          "Esse intervalo de horário não está disponível."
        );
        syncBookingButton();
        return;
      }

      setInlineMessage(bookingMessage);

      const targetUrl = `${pageUrl(`pages/agendamento.html?id=${court.id}`)}&date=${selectedDetailDate}&time=${state.selectedBookingTime}&duration=${state.selectedBookingDuration}`;

      if (getCurrentUser()) {
        window.location.href = targetUrl;
        return;
      }

      showBookingAuthModal(court.id, {
        date: selectedDetailDate,
        time: state.selectedBookingTime,
        duration: state.selectedBookingDuration,
      });
    });
  };

  const initAgendamentoPage = () => {
    const summaryNode = document.getElementById("agendamento-quadra");
    const form = document.getElementById("agendamento-form");
    const bookingDate = document.getElementById("booking-date");
    const bookingModalidade = document.getElementById("booking-modalidade");
    const bookingTime = document.getElementById("booking-time");
    const bookingEnd = document.getElementById("booking-end");
    const recapNode = document.getElementById("booking-recap");
    const submitButton = document.getElementById("booking-submit");
    const formMessage = document.getElementById("booking-form-message");
    const summaryCard = document.querySelector(".booking-summary-card");

    if (
      !summaryNode ||
      !form ||
      !bookingDate ||
      !bookingModalidade ||
      !bookingTime ||
      !bookingEnd ||
      !recapNode ||
      !submitButton ||
      !formMessage ||
      !summaryCard
    ) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const court = getCourtById(params.get("id")) || getActiveCourts()[0];

    if (!court) {
      return;
    }

    state.selectedBookingTime = null;
    state.selectedBookingDuration = 1;
    let selectedBookingDate = getTodayDateString();

    const setInlineMessage = (message = "") => {
      formMessage.textContent = message;
      formMessage.hidden = !message;
    };

    const requestedDate = params.get("date");
    if (requestedDate && !isPastDateString(requestedDate)) {
      selectedBookingDate = requestedDate;
    }

    const courtModalities = getUniqueTags([
      ...(Array.isArray(court.modalidades) ? court.modalidades : []),
      court.modalidade,
    ]);
    const allowedModalities = courtModalities.length ? courtModalities : [court.modalidade];

    bookingModalidade.innerHTML = allowedModalities
      .map((modalidade) => `<option value="${modalidade}">${modalidade}</option>`)
      .join("");
    bookingModalidade.value = allowedModalities.includes(court.modalidade)
      ? court.modalidade
      : allowedModalities[0];
    bookingModalidade.disabled = allowedModalities.length <= 1;
    bookingModalidade.title = bookingModalidade.disabled
      ? "Esta quadra possui modalidade fixa."
      : "Escolha a modalidade disponível para este local.";
    const bookingModalidadeSelect = createCustomSelect(bookingModalidade);

    summaryNode.innerHTML = `
      <div class="app-card booking-court-card">
        <img class="card-cover" src="${assetUrl(court.imagem)}" alt="${court.nome}" />
        <div class="card-body">
          <span class="detail-location">${court.cidade.toUpperCase()}/SP</span>
          <h3>${court.nome}</h3>
          <div class="booking-court-meta">
            <p>${court.modalidade} • ${court.bairro}</p>
            <strong class="booking-price-badge">${formatCurrency(court.preco)}/hora</strong>
          </div>
          <div class="tag-row">${buildFacilityBadges(court.estrutura.slice(0, 4))}</div>
        </div>
        <div class="booking-court-note">
          ${court.descricao}
        </div>
      </div>
    `;

    const bookingDatePicker = createCustomDatePicker(bookingDate, {
      onChange: (nextValue) => {
        selectedBookingDate = nextValue || getTodayDateString();
        state.selectedBookingTime = null;
        state.selectedBookingDuration = 1;
        setInlineMessage();
        renderSchedule();
      },
    });

    const getScheduleForSelection = () =>
      selectedBookingDate ? getDetailScheduleForDate(court.id, selectedBookingDate) : [];

    const getAvailableStartOptions = (schedule) =>
      getSelectableTimeOptions(court, schedule, 1)
        .filter((option) => !option.disabled)
        .map((option) => option.value);

    const getAvailableEndOptions = (schedule, startTime) => {
      if (!startTime) {
        return [];
      }

      const startMinutes = timeToMinutes(startTime);
      const closeMinutes = timeToMinutes(court.horarioFechamento || "22:00");
      const candidateTimes = [];

      for (let minutes = startMinutes + 60; minutes <= closeMinutes; minutes += 60) {
        candidateTimes.push(minutesToTime(minutes));
      }

      return candidateTimes.reduce((options, endTime) => {
        const duration = getDurationFromRange(startTime, endTime);

        if (duration < 1) {
          return options;
        }

        if (!isRangeAvailableForCourt(court, schedule, startTime, duration)) {
          return options;
        }

        options.push({
          value: endTime,
          label: endTime,
          disabled: false,
        });

        return options;
      }, []);
    };

    const getReservationSnapshot = () => {
      const totalValue = Number(court.preco || 0) * Number(state.selectedBookingDuration || 0);
      const endTime = state.selectedBookingTime
        ? getBookingEndTime(state.selectedBookingTime, state.selectedBookingDuration)
        : "";

      return {
        modalidade: bookingModalidade.value || court.modalidade,
        data: selectedBookingDate,
        horario: state.selectedBookingTime
          ? `${state.selectedBookingTime} às ${endTime || "Selecione"}`
          : "Selecione",
        duracao: state.selectedBookingTime ? formatDurationLabel(state.selectedBookingDuration) : "Selecione",
        valor: totalValue,
      };
    };

    const renderRecap = () => {
      const snapshot = getReservationSnapshot();
      recapNode.innerHTML = `
        <div class="recap-item">
          <span>Quadra</span>
          <strong>${court.nome}</strong>
        </div>
        <div class="recap-item">
          <span>Modalidade</span>
          <strong>${snapshot.modalidade}</strong>
        </div>
        <div class="recap-item">
          <span>Data</span>
          <strong>${snapshot.data ? formatDate(snapshot.data) : "Selecione"}</strong>
        </div>
        <div class="recap-item">
          <span>Horário</span>
          <strong>${snapshot.horario}</strong>
        </div>
        <div class="recap-item">
          <span>Duração</span>
          <strong>${snapshot.duracao}</strong>
        </div>
        <div class="recap-item is-highlight">
          <span>Valor estimado</span>
          <strong>${snapshot.valor ? formatCurrency(snapshot.valor) : "Selecione"}</strong>
        </div>
      `;
    };

    const bookingTimePicker = createCustomTimePicker(bookingTime, {
      onChange: (nextValue) => {
        const schedule = getScheduleForSelection();

        if (
          nextValue &&
          !isRangeAvailableForCourt(court, schedule, nextValue, 1)
        ) {
          state.selectedBookingTime = null;
          setInlineMessage("Esse horário não está disponível para reserva.");
          renderSchedule();
          return;
        }

        state.selectedBookingTime = nextValue;
        state.selectedBookingDuration = 1;
        setInlineMessage();
        renderSchedule();
      },
    });
    const bookingEndPicker = createOptionPicker(bookingEnd, {
      placeholder: "Selecione o final",
      onChange: (nextValue) => {
        const duration = getDurationFromRange(state.selectedBookingTime, nextValue);

        if (duration < 1) {
          setInlineMessage("Escolha um horário final válido.");
          renderSchedule();
          return;
        }

        state.selectedBookingDuration = duration;
        setInlineMessage();
        renderSchedule();
      },
    });

    const syncSubmitButton = () => {
      const isReady = Boolean(
        selectedBookingDate &&
        state.selectedBookingTime &&
        state.selectedBookingDuration >= 1
      );

      submitButton.disabled = !isReady;
      submitButton.classList.toggle("is-disabled", !isReady);
    };

    const syncSummaryHeight = () => {
      if (window.innerWidth <= 1120) {
        summaryCard.style.height = "";
        return;
      }

      summaryCard.style.height = `${form.getBoundingClientRect().height}px`;
    };

    const renderSchedule = () => {
      const schedule = getScheduleForSelection();
      const timeOptions = getAvailableStartOptions(schedule);

      if (state.selectedBookingTime && !timeOptions.includes(state.selectedBookingTime)) {
        state.selectedBookingTime = null;
        state.selectedBookingDuration = 1;
      }

      let endOptions = getAvailableEndOptions(schedule, state.selectedBookingTime);
      let currentEndValue = state.selectedBookingTime
        ? getBookingEndTime(state.selectedBookingTime, state.selectedBookingDuration)
        : "";

      if (
        state.selectedBookingTime &&
        currentEndValue &&
        !endOptions.some((option) => option.value === currentEndValue)
      ) {
        state.selectedBookingDuration = 1;
        currentEndValue = state.selectedBookingTime
          ? getBookingEndTime(state.selectedBookingTime, state.selectedBookingDuration)
          : "";
        endOptions = getAvailableEndOptions(schedule, state.selectedBookingTime);
      }

      bookingTimePicker.setState({
        values: timeOptions,
        value: state.selectedBookingTime || "",
        disabled: !timeOptions.length,
      });
      bookingEndPicker.setState({
        options: endOptions,
        value:
          state.selectedBookingTime && endOptions.some((option) => option.value === currentEndValue)
            ? currentEndValue
            : "",
        disabled: !state.selectedBookingTime || !endOptions.length,
      });

      bookingDatePicker.setState({ value: selectedBookingDate, minDate: getTodayDateString() });
      renderRecap();
      syncSubmitButton();
      syncSummaryHeight();
    };

    bookingModalidade.addEventListener("change", () => {
      renderRecap();
    });

    const requestedTime = params.get("time");
    if (requestedTime) {
      if (
        isRangeAvailableForCourt(
          court,
          getScheduleForSelection(),
          requestedTime,
          1
        )
      ) {
        state.selectedBookingTime = requestedTime;
      }
    }

    const requestedDuration = Math.max(1, Number(params.get("duration") || 1));
    if (
      state.selectedBookingTime &&
      isRangeAvailableForCourt(
        court,
        getScheduleForSelection(),
        state.selectedBookingTime,
        requestedDuration
      )
    ) {
      state.selectedBookingDuration = requestedDuration;
    }

    bookingModalidadeSelect?.render();
    renderSchedule();
    syncSummaryHeight();
    window.addEventListener("resize", syncSummaryHeight);

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!selectedBookingDate || !state.selectedBookingTime || state.selectedBookingDuration < 1) {
        setInlineMessage("Selecione a data, o horário inicial e o horário final.");
        syncSubmitButton();
        return;
      }

      if (
        !isRangeAvailableForCourt(
          court,
          getScheduleForSelection(),
          state.selectedBookingTime,
          state.selectedBookingDuration
        )
      ) {
        setInlineMessage("Esse intervalo de horário não está disponível.");
        return;
      }

      const user = getCurrentUser();

      if (!user) {
        showBookingAuthModal(court.id, {
          date: selectedBookingDate,
          time: state.selectedBookingTime,
          duration: state.selectedBookingDuration,
        });
        return;
      }

      setInlineMessage();

      showModal({
        title: "Confirmar Reserva",
        html: `
          <div class="help-modal-content">
            <p>Confira os dados antes de concluir o agendamento.</p>
            <div class="info-grid booking-selection-grid">
              <div><span class="detail-label">Quadra</span><p>${court.nome}</p></div>
              <div><span class="detail-label">Data</span><p>${formatDate(selectedBookingDate)}</p></div>
              <div><span class="detail-label">Horário</span><p>${formatBookingWindow(state.selectedBookingTime, state.selectedBookingDuration)}</p></div>
              <div><span class="detail-label">Valor estimado</span><p>${formatCurrency(Number(court.preco || 0) * Number(state.selectedBookingDuration || 1))}</p></div>
            </div>
          </div>
        `,
        actions: [
          {
            label: "Confirmar reserva",
            variant: "primary",
            onClick: () => {
              createReservation({
                cliente: user?.name || "Usuário Agendei Quadras",
                userEmail: user?.email || "",
                telefone: "",
                courtId: court.id,
                quadra: court.nome,
                modalidade: bookingModalidade.value || court.modalidade,
                data: selectedBookingDate,
                horario: state.selectedBookingTime,
                duracao: state.selectedBookingDuration,
                valor: Number(court.preco || 0) * Number(state.selectedBookingDuration || 1),
                observacoes: form.observacoes.value.trim(),
              });

              closeSharedModal();
              form.observacoes.value = "";
              state.selectedBookingTime = null;
              state.selectedBookingDuration = 1;
              renderSchedule();
              showToast("Reserva confirmada com sucesso.", "success");
            },
          },
          {
            label: "Cancelar",
            variant: "secondary",
            onClick: () => closeSharedModal(),
          },
        ],
      });
    });

  };

  const initReservasPage = () => {
    const listNode = document.getElementById("reservas-list");

    if (!listNode) {
      return;
    }

    const currentUser = requireAuthenticatedUser({
      redirectTo: pageUrl("login.html"),
      role: "cliente",
      message: "Faça login com uma conta cadastrada para acessar Minhas Reservas.",
    });

    if (!currentUser) {
      return;
    }

    const renderReservations = () => {
      const reservations = getReservations().filter(
        (reservation) => normalizeEmail(reservation.userEmail) === normalizeEmail(currentUser.email)
      );

      if (!reservations.length) {
        listNode.innerHTML = `
          <article class="app-card empty-state-card">
            <h3>Nenhuma reserva encontrada</h3>
            <p>Esta conta ainda não possui reservas registradas.</p>
            <div class="inline-actions">
              <a class="button btn-primary" href="${pageUrl("quadras.html")}">Buscar quadras</a>
            </div>
          </article>
        `;
        return;
      }

      listNode.innerHTML = reservations
        .map((reservation) => {
          const court = getCourtById(reservation.courtId) || {};

          return `
            <article class="app-card reservation-card">
              <div class="reservation-head">
                <div>
                  <h3>${reservation.quadra}</h3>
                  <p>${reservation.modalidade} • ${formatDate(reservation.data)} • ${formatBookingWindow(reservation.horario, reservation.duracao || 1)}</p>
                </div>
                <span class="status-pill ${statusClass(reservation.status)}">${reservation.status}</span>
              </div>
              <div class="reservation-meta">
                <span><strong>Cliente:</strong> ${reservation.cliente}</span>
                <span><strong>Duração:</strong> ${formatDurationLabel(reservation.duracao || 1)}</span>
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
            <td>${formatBookingWindow(reservation.horario, reservation.duracao || 1)}</td>
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

    enforceMinDate(dateInput, {
      defaultToToday: true,
      onInvalid: () =>
        showToast("A agenda administrativa aceita apenas hoje ou datas futuras.", "error"),
    });

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
            <td>${reservation.duracao || 1}</td>
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
    const headerCta =
      document.querySelector("[data-header-cta]") ||
      document.querySelector(".header-actions .header-cta");
    const headerActions = headerCta?.closest(".header-actions") || null;

    const headerUserLabels = Array.from(
      document.querySelectorAll("[data-current-user], .header-actions .header-link")
    );

    headerUserLabels.forEach((target) => {
      target.textContent = "";
      target.hidden = true;
    });

    document.querySelectorAll("[data-auth-only]").forEach((node) => {
      node.hidden = !currentUser;
    });

    document.querySelectorAll("[data-guest-only]").forEach((node) => {
      node.hidden = Boolean(currentUser);
    });

    if (headerCta) {
      if (currentUser) {
        const accountHref =
          currentUser.role === "Proprietário"
            ? pageUrl("admin-dashboard.html")
            : pageUrl("minhas-reservas.html");

        headerCta.classList.add("header-user-button");
        headerCta.href = accountHref;
        headerCta.setAttribute("aria-expanded", "false");
        headerCta.setAttribute("aria-haspopup", "menu");
        headerCta.innerHTML = `
          <span class="header-user-chip">
            <img class="header-user-icon" src="${assetUrl("assets/icons/user-svgrepo-com.svg")}" alt="" aria-hidden="true" />
            <span class="header-user-name">${currentUser.name}</span>
            <span class="header-user-caret" aria-hidden="true"></span>
          </span>
        `;

        let dropdown = headerActions?.querySelector(".header-user-dropdown");

        if (!dropdown && headerActions) {
          dropdown = document.createElement("div");
          dropdown.className = "header-user-dropdown";
          dropdown.setAttribute("role", "menu");
          dropdown.innerHTML = `
            <a class="header-user-dropdown-item" href="${accountHref}" role="menuitem">
              ${currentUser.role === "Proprietário" ? "Painel" : "Minhas reservas"}
            </a>
            <button class="header-user-dropdown-item" type="button" role="menuitem" data-logout>
              Sair
            </button>
          `;
          headerActions.appendChild(dropdown);
        } else if (dropdown) {
          dropdown.innerHTML = `
            <a class="header-user-dropdown-item" href="${accountHref}" role="menuitem">
              ${currentUser.role === "Proprietário" ? "Painel" : "Minhas reservas"}
            </a>
            <button class="header-user-dropdown-item" type="button" role="menuitem" data-logout>
              Sair
            </button>
          `;
        }

        const closeProfileMenu = () => {
          headerCta.setAttribute("aria-expanded", "false");
          headerActions?.classList.remove("is-profile-open");
        };

        headerCta.addEventListener("click", (event) => {
          event.preventDefault();
          const isOpen = headerCta.getAttribute("aria-expanded") === "true";
          headerCta.setAttribute("aria-expanded", String(!isOpen));
          headerActions?.classList.toggle("is-profile-open", !isOpen);
        });

        document.addEventListener("click", (event) => {
          if (!headerActions?.contains(event.target)) {
            closeProfileMenu();
          }
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            closeProfileMenu();
          }
        });
      } else {
        headerCta.classList.remove("header-user-button");
        headerCta.removeAttribute("aria-expanded");
        headerCta.removeAttribute("aria-haspopup");
        headerCta.textContent = "Entrar";
        headerCta.href = pageUrl("login.html");
        headerActions?.classList.remove("is-profile-open");
        headerActions?.querySelector(".header-user-dropdown")?.remove();
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
