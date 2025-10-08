<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12 mt-8">
  {fiberPlans.map((plan, index) => (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      {/* Decorative glow */}
      <div
        className={`absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${plan.bgColor}`}
      ></div>

      <div
        className={`relative backdrop-blur-md bg-white/80 border ${plan.borderColor} rounded-3xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.35)] transition-all duration-300 flex flex-col h-full`}
      >
        {/* Ribbon */}
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
            <span className="px-3 py-1.5 text-xs font-bold bg-green-600 text-white rounded-full shadow-lg">
              Most Popular
            </span>
          </div>
        )}

        {/* Header */}
        <div className={`relative ${plan.headerBg} text-white px-5 py-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold tracking-wide uppercase">
              {plan.name}
            </h3>
            <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-full">
              Secure Fiber
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight">
            {plan.speed}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Price */}
          <div className="text-center mb-5">
            {plan.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                KES {plan.originalPrice}
              </div>
            )}
            <div className="text-3xl font-black text-gray-900">
              KES {plan.price}
              <span className="ml-1 text-sm font-medium text-gray-500">
                /month
              </span>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-2.5 mb-5">
            {plan.features.map((feature, idx) => {
              const included = plan.includedFeatures.includes(idx);
              return (
                <li key={idx} className="flex items-start text-sm">
                  {included ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <span className="w-4 h-4 mt-0.5 mr-2 flex items-center justify-center flex-shrink-0">
                      <span className="w-3 h-0.5 bg-red-400 rounded" />
                    </span>
                  )}
                  <span
                    className={included ? "text-gray-700" : "text-gray-400"}
                  >
                    {feature}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <button
            onClick={() => openWhatsApp(plan, "Secure Fiber")}
            className={`mt-auto w-full px-4 py-3 rounded-xl text-white font-semibold tracking-wide transition-all duration-300 bg-gradient-to-r ${plan.color} hover:brightness-110 hover:shadow-lg`}
          >
            Get Connected
          </button>
        </div>
      </div>
    </motion.div>
  ))}
</div>;
